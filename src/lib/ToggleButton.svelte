<script lang="ts">
	import { untrack } from 'svelte';

	let {
		id,
		displayName,
		color,
		isActive = $bindable(),
		group = $bindable([])
	}: {
		id?: string;
		displayName: string;
		color: string;
		isActive: boolean;
		group?: string[];
	} = $props();

	$effect(() => {
		(() => isActive)();
		untrack(() => {
			updateGroups(isActive);
		});
	});

	$effect(() => {
		(() => group)();
		untrack(() => {
			if (id !== undefined) {
				isActive = group.includes(id);
			}
		});
	});

	function updateGroups(checked: boolean) {
		isActive = checked;

		if (group !== undefined && id !== undefined) {
			if (isActive && !group.includes(id)) {
				group = group.concat(id);
			} else if (!isActive && group.includes(id)) {
				group = group.filter((item) => item !== id);
			}
		}
	}

	function onChange(e: { currentTarget: EventTarget & HTMLInputElement }) {
		updateGroups(e.currentTarget.checked);
	}

	updateGroups(isActive);
</script>

<label
	style="
        border-color: {color};
        background-color: {isActive ? color : 'transparent'};
        color: {isActive ? 'white' : color}"
>
	<input
		type="checkbox"
		name={id || displayName}
		value={id || displayName}
		bind:checked={isActive}
		onchange={onChange}
	/>
	{displayName}
</label>

<style>
	label {
		padding: 0.3rem 0.6rem;
		border-radius: 0.5rem;
		border-width: 3px;
		border-style: solid;
		cursor: pointer;
	}

	input {
		display: none;
	}
</style>
