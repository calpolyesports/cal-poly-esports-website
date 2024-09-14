<script lang="ts" context="module">
    export type ModalFieldDefinition = { name: string, type: 'date' | 'text' | 'dropdown', options?: [string, string][] };
    export type FilledModalFields = { [key: string]: string | Date };
    export type ModalAction = { name: string, callback: (values: FilledModalFields) => Promise<void> };
</script>

<script lang="ts">
    export let show = false;
    export let title = '';
    export let fields: ModalFieldDefinition[];
    export let actions: ModalAction[];

    const bindings = fields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
    }, {} as { [key: string]: string });

    export const fillFields = (values: FilledModalFields) => {
        clearFields();
        fields.forEach(field => {
            const element = document.getElementById(field.name) as HTMLInputElement | HTMLSelectElement;
            const value = values[field.name];
            if (!value) return;
            if (field.type === 'date') {
                const originalTime = new Date(value);
                const adjustedTime = new Date(originalTime.getTime() - originalTime.getTimezoneOffset() * 60000);
                bindings[field.name] = adjustedTime.toISOString().slice(0, 16);
            } else {
                bindings[field.name] = value.toString();
            }
        });
    };

    export const clearFields = () => {
        fields.forEach(field => {
            const element = document.getElementById(field.name) as HTMLInputElement | HTMLSelectElement;
            bindings[field.name] = '';
        });
    };

    async function runCallbackWithFormData(callback: (values: FilledModalFields) => Promise<void>) {
        const formData: FilledModalFields = {};
        fields.forEach(field => {
            const value = bindings[field.name];
            formData[field.name] = field.type === 'date' ? new Date(value) : value;
        });
        await callback(formData);
        show = false;
    }
</script>

<div class="modal" style="display: {show ? 'flex' : 'none'}">
    <div class="modal-content">
        <button class="close" on:click={() => show = false}>&times;</button>
        <h2>{title}</h2>
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
                {/if}
            {/each}
            <br>
            {#each actions as action}
                <button class="button-medium" on:click={() => runCallbackWithFormData(action.callback)}>{action.name}</button>
            {/each}
        </div>
    </div>
</div>

<style>
    .modal {
        display: none;
        justify-content: center;
        align-items: center;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0,0.4);
    }

    .modal-content {
        background-color: #fefefe;
        margin: auto;
        padding: 2rem;
        border: 1px solid #888;
        width: 40rem;
    }

    h2 {
        text-align: center;
    }

    button.close {
        color: #aaa;
        float: right;
        font-size: 2.5rem;
        font-weight: bold;
        border: none;
        background-color: transparent;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }

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
</style>
