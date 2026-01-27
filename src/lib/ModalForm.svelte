<script lang="ts" module>
	export type ModalFieldDefinition = {
		id: string;
		name: string;
		type: 'date' | 'text' | 'textarea' | 'dropdown' | 'file' | 'checkbox';
		required?: boolean;
		options?: [string, string][];
		validExtensions?: [string];
		rows?: number;
	};
	export type FilledModalFields = { [key: string]: string | Date | File | boolean | null };
	export type ModalAction = {
		name: string;
		action: string;
	};
	export type ModalErrors = { [key: string]: string };
</script>

<script lang="ts">
	import { tick } from 'svelte';
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

	// TODO: this is never updated
	let errors: ModalErrors = $state({});
	let formError: string = $state('');
	let submittingAction: string | null = $state(null);

	const bindings = $state(
		// TODO: find out how to ignore this warning
		fields.reduce(
			(acc, field) => {
				if (field.type === 'file') {
					acc[field.id] = null;
				} else if (field.type === 'checkbox') {
					acc[field.id] = false;
				} else {
					acc[field.id] = '';
				}
				return acc;
			},
			{} as { [key: string]: string | File | boolean | null }
		)
	);

	let modal: Modal;
	let formElement: HTMLFormElement;

	export const showModal = async () => {
		modal.showModal();
		await tick();
		const focusable = formElement?.querySelector<HTMLElement>(
			'input[type="text"], input[type="datetime-local"], select, textarea'
		);
		focusable?.focus();
	};

	export const hideModal = () => {
		modal.hideModal();
	};

	export const fillFields = (values: FilledModalFields) => {
		clearFields();
		fields.forEach((field) => {
			const value = values[field.id];
			if (field.type === 'date') {
				const originalTime = new Date(value as string);
				const adjustedTime = new Date(
					originalTime.getTime() - originalTime.getTimezoneOffset() * 60000
				);
				bindings[field.id] = adjustedTime.toISOString().slice(0, 16);
			} else if (field.type === 'checkbox') {
				bindings[field.id] = value as boolean;
			} else if (field.type !== 'file' && value) {
				bindings[field.id] = value.toString();
			}
		});
	};

	export const clearFields = () => {
		fields.forEach((field) => {
			if (field.type === 'file') {
				bindings[field.id] = null;
			} else if (field.type === 'checkbox') {
				bindings[field.id] = false;
			} else {
				bindings[field.id] = '';
			}
		});
		formError = '';
		submittingAction = null;
	};
</script>

<Modal bind:this={modal} bind:title>
	<form
		method="POST"
		enctype="multipart/form-data"
		bind:this={formElement}
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
		{#each fields as field (field.id)}
			<div class={field.type === 'checkbox' ? 'checkbox-container' : 'input-container'}>
				<label for={field.id}>
					{field.name}
					{#if field.required}
						<span class="required-asterisk">*</span>
					{/if}
				</label>
				{#if field.type === 'date'}
					<input
						type="hidden"
						name={field.id}
						value={bindings[field.id] ? new Date(bindings[field.id] as string).toISOString() : ''}
					/>
					<input
						type="datetime-local"
						id={field.id}
						name="{field.id}_display"
						bind:value={bindings[field.id]}
					/>
				{:else if field.type === 'text'}
					<input type="text" id={field.id} name={field.id} bind:value={bindings[field.id]} />
				{:else if field.type === 'textarea'}
					<textarea
						id={field.id}
						name={field.id}
						rows={field.rows || 4}
						bind:value={bindings[field.id]}
					></textarea>
				{:else if field.type === 'dropdown' && field.options}
					<select id={field.id} name={field.id} bind:value={bindings[field.id]}>
						{#each field.options as option (option[0])}
							<option value={option[0]}>{option[1]}</option>
						{/each}
					</select>
				{:else if field.type === 'file'}
					<input id={field.id} name={field.id} type="file" accept={field.validExtensions?.join()} />
				{:else if field.type === 'checkbox'}
					<input
						type="checkbox"
						id={field.id}
						name={field.id}
						bind:checked={bindings[field.id] as boolean}
					/>
				{/if}
				{#if field.id in errors}
					<p class="error-message">{errors[field.id]}</p>
				{/if}
			</div>
		{/each}

		{#if extraInfo}
			{#each Object.entries(extraInfo) as [key, value] (key)}
				<input type="hidden" name={key} {value} />
			{/each}
		{/if}

		<div class="actions">
			{#each actions as action (action.name)}
				<button
					class="button-medium"
					type="submit"
					formaction={action.action}
					disabled={submittingAction === action.action}>{action.name}</button
				>
			{/each}
		</div>
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

	.checkbox-container {
		margin: 0.5rem 0;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.input-container {
		margin: 0.5rem 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.actions {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.input-container label {
		font-size: 1rem;
		font-weight: bold;
		text-transform: capitalize;
	}

	.checkbox-container label {
		font-size: 1.25rem;
		text-transform: capitalize;
	}

	input {
		font-size: 1.25rem;
		padding: 0.5rem;
		width: 100%;
	}

	input[type='checkbox'] {
		width: fit-content;
	}

	textarea {
		font-size: 1.25rem;
		padding: 0.5rem;
		width: 100%;
		resize: vertical;
		font-family: inherit;
	}

	select {
		font-size: 1.25rem;
		padding: 0.5rem;
		width: 100%;
		background-color: white;
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
