<script lang="ts" context="module">
    export type ModalFieldDefinition = { 
        name: string, 
        type: 'date' | 'text' | 'dropdown' | 'file' | 'boolean', 
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
    export let fields: ModalFieldDefinition[];
    export let actions: ModalAction[];
    export let showPublicCheckbox = false; // New prop to indicate whether to show the "public" checkbox

    let fileError = '';
    let isFileValid = true;

    const bindings = fields.reduce((acc, field) => {
        acc[field.name] = field.type === 'file' ? null : '';
        return acc;
    }, {} as { [key: string]: string | File | boolean | null });

    if (showPublicCheckbox) {
        bindings['showPublic'] = false; // Default value for the public checkbox
    }

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
            if (!value) return;
            if (field.type === 'date') {
                const originalTime = new Date(value as string);
                const adjustedTime = new Date(originalTime.getTime() - originalTime.getTimezoneOffset() * 60000);
                bindings[field.name] = adjustedTime.toISOString().slice(0, 16);
            } else if (field.type !== 'file') {
                bindings[field.name] = value.toString();
            }
        });

        if (showPublicCheckbox && 'showPublic' in values) {
            bindings['showPublic'] = values['showPublic'] as boolean;
        }
    };

    export const clearFields = () => {
        fields.forEach(field => {
            bindings[field.name] = field.type === 'file' ? null : '';
        });

        if (showPublicCheckbox) {
            bindings['showPublic'] = false;
        }
    };

    async function runCallbackWithFormData(callback: (values: FilledModalFields) => Promise<void>) {
        const formData: FilledModalFields = {};
        fields.forEach(field => {
            const value = bindings[field.name];
            formData[field.name] = field.type === 'date' ? new Date(value as any) : value;
        });

        if (showPublicCheckbox) {
            formData['showPublic'] = bindings['showPublic'] as boolean;
        }

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
            <label for={field.name}>{field.name}</label>
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
            {/if}
        {/each}

        <!-- Add public checkbox only if in admin context -->
        {#if showPublicCheckbox}
            <label for="showPublic">Show on Public Calendar</label>
            <input type="checkbox" id="showPublic" name="showPublic" bind:checked={bindings['showPublic']} />
        {/if}

        <br>
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
</style>
