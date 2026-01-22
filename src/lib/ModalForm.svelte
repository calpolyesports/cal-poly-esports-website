<script lang="ts" module>
	export type ModalFieldDefinition = {
		name: string;
		type: 'date' | 'text' | 'dropdown' | 'file' | 'checkbox';
		required: boolean;
		options?: [string, string][];
		validExtensions?: [string];
	};
	export type FilledModalFields = { [key: string]: string | Date | File | boolean | null };
	export type ModalAction = {
		name: string;
		action: string;
	};
	export type ModalErrors = { [key: string]: string };
</script>

<script lang="ts">
	import Modal from './Modal.svelte';
	import { enhance } from '$app/forms';

	let {
		title,
		fields = [],
		actions = [],
		extraInfo
	}: {
		title: string;
		fields?: ModalFieldDefinition[];
		actions?: ModalAction[];
		extraInfo?: Record<string, string>;
	} = $props();

	let errors: ModalErrors = $state({});
	let formError: string = $state('');
	let submittingAction: string | null = $state(null);

	const bindings = $state(
		// TODO: find out how to ignore this warning
		fields.reduce(
			(acc, field) => {
				if (field.type === 'file') {
					acc[field.name] = null;
				} else if (field.type === 'checkbox') {
					acc[field.name] = false;
				} else {
					acc[field.name] = '';
				}
				return acc;
			},
			{} as { [key: string]: string | File | boolean | null }
		)
	);

	let modal: Modal;

	export const showModal = () => {
		modal.showModal();
	};

	export const hideModal = () => {
		modal.hideModal();
	};

	export const fillFields = (values: FilledModalFields) => {
		clearFields();
		fields.forEach((field) => {
			const value = values[field.name];
			if (field.type === 'date') {
				const originalTime = new Date(value as string);
				const adjustedTime = new Date(
					originalTime.getTime() - originalTime.getTimezoneOffset() * 60000
				);
				bindings[field.name] = adjustedTime.toISOString().slice(0, 16);
			} else if (field.type === 'checkbox') {
				bindings[field.name] = value as boolean;
			} else if (field.type !== 'file' && value) {
				bindings[field.name] = value.toString();
			}
		});
	};

	export const clearFields = () => {
		fields.forEach((field) => {
			if (field.type === 'file') {
				bindings[field.name] = null;
			} else if (field.type === 'checkbox') {
				bindings[field.name] = false;
			} else {
				bindings[field.name] = '';
			}
		});
		errors = {};
		formError = '';
		submittingAction = null;
	};
</script>

<Modal bind:this={modal} bind:title>
	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={({ action }) => {
			submittingAction = action.searchParams.get('action');
			return async ({ result, update }) => {
				if (result.type === 'failure') {
					formError = (result.data as { message?: string })?.message || 'An error occurred';
				} else if (result.type === 'success') {
					hideModal();
				}
				submittingAction = null;
				await update();
			};
		}}
	>
		{#if formError}
			<p class="error-message">{formError}</p>
		{/if}
		{#each fields as field (field.name)}
			<label for={field.name}>
				{field.name}
				{#if field.required}
					<span class="required-asterisk">*</span>
				{/if}
			</label>
			{#if field.type === 'date'}
				<input
					type="datetime-local"
					id={field.name}
					name={field.name}
					bind:value={bindings[field.name]}
				/>
			{:else if field.type === 'text'}
				<input type="text" id={field.name} name={field.name} bind:value={bindings[field.name]} />
			{:else if field.type === 'dropdown' && field.options}
				<select id={field.name} name={field.name} bind:value={bindings[field.name]}>
					{#each field.options as option (option[0])}
						<option value={option[0]}>{option[1]}</option>
					{/each}
				</select>
			{:else if field.type === 'file'}
				<input
					id={field.name}
					name={field.name}
					type="file"
					accept={field.validExtensions?.join()}
				/>
			{:else if field.type === 'checkbox'}
				<input
					type="checkbox"
					id={field.name}
					name={field.name}
					bind:checked={bindings[field.name] as boolean}
				/>
			{/if}
			{#if field.name in errors}
				<p class="error-message">{errors[field.name]}</p>
			{/if}
		{/each}

		<br />

		{#if extraInfo}
			{#each Object.entries(extraInfo) as [key, value] (key)}
				<input type="hidden" name={key} {value} />
			{/each}
		{/if}

		{#each actions as action (action.name)}
			<button
				class="button-medium"
				type="submit"
				formaction={action.action}
				disabled={submittingAction === action.action}>{action.name}</button
			>
		{/each}
	</form>
</Modal>

<style>
	form {
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
