<script lang="ts" context="module">
    export type ModalFieldDefinition = { 
        name: string, 
        type: 'date' | 'text' | 'dropdown' | 'file' | 'checkbox', 
        options?: [string, string][],
        accept?: string
    };
    export type FilledModalFields = { [key: string]: string | Date | File | boolean | null };
    export type ModalAction = { name: string, callback: (values: FilledModalFields) => Promise<void> };
</script>

<script lang="ts">
    import Modal from './Modal.svelte';
    import { createEventDispatcher } from 'svelte';

    export let title = '';
    export let fields: ModalFieldDefinition[] = [];
    export let actions: ModalAction[] = [];

    let fileError = '';
    let isFileValid = true;
    let validationError = '';
    let timeError = '';

    const bindings = fields.reduce((acc, field) => {
        if (field.type === 'file') {
            acc[field.name] = null;
        } else if (field.type === 'checkbox') {
            acc[field.name] = false;
        } else {
            acc[field.name] = '';
        }
        return acc;
    }, {} as { [key: string]: string | File | boolean | null });

    const dispatch = createEventDispatcher();

    let modal: Modal;

    export const showModal = () => {
        modal.showModal();
    };

    export const hideModal = () => {
        modal.hideModal();
    };

    export const fillFields = (values: FilledModalFields) => {
        clearFields();
        fields.forEach(field => {
            const value = values[field.name];
            if (field.type === 'date') {
                const originalTime = new Date(value as string);
                const adjustedTime = new Date(originalTime.getTime() - originalTime.getTimezoneOffset() * 60000);
                bindings[field.name] = adjustedTime.toISOString().slice(0, 16);
            } else if (field.type === "checkbox") {
                bindings[field.name] = value as boolean;
            } else if (field.type !== 'file' && value) {
                bindings[field.name] = value.toString();
            }
        });
    };

    export const clearFields = () => {
        fields.forEach(field => {
            if (field.type === 'file') {
                bindings[field.name] = null;
            } else if (field.type === 'checkbox') {
                bindings[field.name] = false;
            } else {
                bindings[field.name] = '';
            }
        });
        validationError = '';
        timeError = '';
    };

    async function runCallbackWithFormData(callback: (values: FilledModalFields) => Promise<void>) {
        const formData: FilledModalFields = {};
        fields.forEach(field => {
            const value = bindings[field.name];
            formData[field.name] = field.type === 'date' ? new Date(value as any) : value;
        });

        if (!bindings['showPublic'] && !bindings['usesLab']) {
            validationError = 'An event must either be public or use the lab!';
            return;
        } else {
            validationError = '';
        }

        const startTime = new Date(bindings['start'] as string);
        const endTime = new Date(bindings['end'] as string);
        
        if (endTime <= startTime) {
            timeError = 'End time must be after start time!';
            return;
        } else {
            timeError = '';
        }

        const requiredFields = ['Title', 'Start', 'End', 'Club', 'Location'];
        for (const field of requiredFields) {
            if (!bindings[field.toLowerCase()]) {
                validationError = `${field} is required!`;
                return;
            }
        }

        validationError = '';

        await callback(formData);
        hideModal();
    }

    function handleFileChange(event: Event, field: ModalFieldDefinition) {
        const input = event.target as HTMLInputElement;

        if (input && input.files && input.files.length > 0) {
            const file = input.files[0];
            const validExtensions = field.accept ? field.accept.split(',').map(ext => ext.trim()) : [];

            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (validExtensions.length > 0 && !validExtensions.includes(`.${fileExtension}`)) {
                fileError = `File must be of type: ${validExtensions.join(', ')}`;
                isFileValid = false;
            } else {
                fileError = '';
                isFileValid = true;
                bindings[field.name] = file;
            }

            dispatch('fileChange', { field, file });
        } else {
            console.error("File input or file selection is invalid");
        }
    }
</script>

<Modal bind:this={modal} bind:title>
    <div class="form">
        {#each fields as field}
            <label for={field.name}>
                {field.name}
                {#if ['title', 'start', 'end', 'club', 'location'].includes(field.name)}
                    <span class="required-asterisk">*</span>
                {/if}
            </label>
            {#if field.type === 'date'}
                <input type="datetime-local" id={field.name} name={field.name} bind:value={bindings[field.name]} />
            {:else if field.type === 'text'}
                <input type="text" id={field.name} name={field.name} bind:value={bindings[field.name]} />
            {:else if field.type === 'dropdown' && field.options}
                <select id={field.name} name={field.name} bind:value={bindings[field.name]}>
                    {#each field.options as option}
                        <option value={option[0]}>{option[1]}</option>
                    {/each}
                </select>
            {:else if field.type === 'file'}
                <input
                    id={field.name}
                    type="file"
                    accept={field.accept}
                    on:change={(event) => handleFileChange(event, field)}
                />
                {#if fileError}
                    <p class="error-message">{fileError}</p>
                {/if}
            {:else if field.type === 'checkbox'}
                <input type="checkbox" id={field.name} name={field.name} bind:checked={bindings[field.name]} />
            {/if}
        {/each}

        <br>

        <!-- Validation error messages -->
        {#if validationError}
            <p class="error-message">{validationError}</p>
        {/if}
        
        {#if timeError}
            <p class="error-message">{timeError}</p>
        {/if}
        
        {#each actions as action}
            <button class="button-medium" on:click={() => runCallbackWithFormData(action.callback)} disabled={!isFileValid}>{action.name}</button>
        {/each}
    </div>
</Modal>

<style>
    div.form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 30rem;
        margin: 1rem auto;
    }

    label {
        font-size: 1rem;
        margin-top: 1rem;
        font-weight: bold;
        text-transform: capitalize;
    }

    input {
        font-size: 1.25rem;
        padding: 0.5rem;
        width: 100%;
    }

    select {
        font-size: 1.25rem;
        padding: 0.5rem;
        width: 100%;
    }

    .button-medium:disabled {
        background-color: gray;
        cursor: not-allowed;
    }

    .error-message {
        color: red;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }

    .required-asterisk {
        color: red;
        margin-left: 5px;
    }
</style>
