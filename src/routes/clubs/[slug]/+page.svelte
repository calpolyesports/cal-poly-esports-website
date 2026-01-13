<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import AboutText from './AboutText.svelte';
	import type { WithStringId, Club } from '$lib/types';
	import ModalForm from '$lib/ModalForm.svelte';
	import type {
		ModalFieldDefinition,
		FilledModalFields,
		ModalErrors
	} from '$lib/ModalForm.svelte';
	import ClubEventLink from './ClubEventLink.svelte';

	export let data;
	let club: WithStringId<Club> | undefined;
	let canEdit: boolean = false;

	$: {
		const { slug } = get(page).params;
		if (slug) {
			club = data.club;
			canEdit = Boolean(data.adminFor.find((admin) => admin.urlName === club?.urlName));
		}
	}

	let editingAbout = false;

	let addMemberModal: ModalForm;

	let editMemberModal: ModalForm;
	let selectedMemberIndex: number | undefined;

	const memberModalFields = [
		{ name: 'name', type: 'text', required: true },
		{ name: 'position', type: 'text', required: true },
		{
			name: 'profileImage',
			type: 'file',
			accept: ['.jpg', '.jpeg', '.png', '.webp'],
			required: true
		}
	] as ModalFieldDefinition[];

	//////////////////////
	// API INTERACTIONS //
	//////////////////////

	const sendSaveAbout = async (updatedClub: Club) => {
		const response = await fetch(`/clubs/${updatedClub.urlName}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ aboutText: updatedClub.aboutText })
		});

		if (response.ok) {
			editingAbout = false;
			const body = await response.json();
			return body.club.aboutHtml;
		}
	};

	const sendAddMember = async (club: Club, formData: any) => {
		const response = await fetch(`/clubs/${club.urlName}/board`, {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			const body = await response.json();
			return body.member;
		}
	};

	const sendUpdateMember = async (club: Club, memberIndex: number, formData: any) => {
		const response = await fetch(`/clubs/${club.urlName}/board/${memberIndex}`, {
			method: 'PUT',
			body: formData
		});

		if (response.ok) {
			const body = await response.json();
			return body.member;
		}
	};

	const sendDeleteMember = async (club: Club, memberIndex: number) => {
		const response = await fetch(`/clubs/${club.urlName}/board/${memberIndex}`, {
			method: 'DELETE'
		});

		return response.ok;
	};

	//////////////
	// HANDLERS //
	//////////////

	const onClickEditAbout = () => {
		editingAbout = true;
	};

	const onSubmitEditAbout = async () => {
		if (club) {
			let newAboutHtml = await sendSaveAbout(club);
			if (newAboutHtml) {
				club.aboutHtml = newAboutHtml;
				editingAbout = false;
			}
		}
	};

	const onClickAddMember = () => {
		addMemberModal.clearFields();
		addMemberModal.showModal();
	};

	const onSubmitAddMember = async (fields: FilledModalFields) => {
		if (club) {
			const formData = new FormData();
			formData.append('name', fields.name as string);
			formData.append('position', fields.position as string);
			formData.append('profileImage', fields.selectedFile as File);

			const member = await sendAddMember(club, formData);
			if (member) {
				club.boardMembers = [...club.boardMembers, member];
				addMemberModal.hideModal();
			}
		}

		return {} as ModalErrors;
	};

	const onClickEditMember = (index: number) => {
		if (!canEdit) return;
		const member = club?.boardMembers[index];
		if (member) {
			selectedMemberIndex = index;
			editMemberModal.fillFields({
				name: member.name,
				position: member.position
			});
			editMemberModal.showModal();
		}
	};

	const onSubmitEditMember = async (fields: FilledModalFields) => {
		if (club && selectedMemberIndex !== undefined) {
			const formData = new FormData();
			formData.append('name', fields.name as string);
			formData.append('position', fields.position as string);
			formData.append('profileImage', fields.selectedFile as File);
			const member = await sendUpdateMember(club, selectedMemberIndex, formData);
			if (member) {
				club.boardMembers = club.boardMembers.map((m, i) =>
					i === selectedMemberIndex ? member : m
				);
				editMemberModal.hideModal();
			}
		}

		return {} as ModalErrors;
	};

	const onSubmitDeleteMember = async () => {
		if (club && selectedMemberIndex !== undefined) {
			const deleted = await sendDeleteMember(club, selectedMemberIndex);
			if (deleted) {
				club.boardMembers = club.boardMembers.filter((_, i) => i !== selectedMemberIndex);
				editMemberModal.hideModal();
			}
		}

		return {} as ModalErrors;
	};
</script>

{#if club}
	<h1>{club.fullName}</h1>
	{#if canEdit && editingAbout}
		<p>
			<strong>This text supports markdown!</strong> Learn more about it
			<a href="https://www.markdownguide.org/basic-syntax/">here</a>.
		</p>
		<textarea bind:value={club.aboutText}></textarea>
		<button class="button-medium" on:click={onSubmitEditAbout}>Save</button>
	{:else}
		{#if canEdit}
			<br />
			<button class="button-medium" on:click={onClickEditAbout}>Edit</button>
		{/if}
		<AboutText html={club.aboutHtml} />
	{/if}

	{#if club.events.length > 0}
		<div class="club-events">
			<h2>Events</h2>
			{#each club.events as event}
				<ClubEventLink {event} />
			{/each}
		</div>
	{/if}

	{#if club.boardMembers.length > 0 || canEdit}
		<h2>Board Members</h2>
		{#if canEdit}
			<button class="button-medium" on:click={onClickAddMember}>Add Board Member</button>
		{/if}
		<ul class="board-members">
			{#each club.boardMembers as member, i}
				<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
				<div on:click={() => onClickEditMember(i)}>
					<li>
						{#if member.profileImage}
							<img src={member.profileImage} alt={member.name} />
						{/if}
						<p>{member.name}</p>
						<p>{member.position}</p>
					</li>
				</div>
			{/each}
		</ul>
	{/if}

	{#if canEdit}
		<ModalForm
			bind:this={addMemberModal}
			title="Add Board Member"
			fields={memberModalFields}
			actions={[{ name: 'Submit', callback: onSubmitAddMember }]}
		/>

		<ModalForm
			bind:this={editMemberModal}
			title="Edit Board Member"
			fields={memberModalFields}
			actions={[
				{ name: 'Submit', callback: onSubmitEditMember },
				{ name: 'Delete', callback: onSubmitDeleteMember }
			]}
		/>
	{/if}
{:else}
	<h1>404</h1>
	<p>Club does not exist</p>
{/if}

<style>
	h1 {
		text-align: center;
		font-size: 2.5rem;
		margin-bottom: 1rem;
		text-decoration-line: underline;
		text-decoration-color: var(--cal-poly-secondary);
		text-decoration-thickness: 0.2rem;
		text-underline-offset: 2rem;
	}

	h2 {
		text-align: center;
		font-size: 2rem;
		margin-bottom: 1rem;
		text-decoration-line: underline;
		text-decoration-color: var(--cal-poly-secondary);
		text-decoration-thickness: 0.2rem;
		text-underline-offset: 1rem;
	}

	@media (max-width: 768px) {
		h1 {
			text-underline-offset: 1rem;
		}

		h1 {
			text-underline-offset: 0.7rem;
		}
	}

	p {
		font-size: 1.5rem;
		margin-bottom: 2rem;
	}

	div.club-events {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		margin: 3rem 0;
	}

	ul.board-members {
		list-style: none;
		padding: 0;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 2rem;
	}

	ul.board-members li {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1.5rem;
		width: 150px;
	}

	ul.board-members li img {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		margin-bottom: 1rem;
		object-fit: cover;
	}

	ul.board-members li p {
		font-size: 1.2rem;
		margin: 0.5rem 0;
		text-align: center;
	}

	textarea {
		width: 50rem;
		height: 20rem;
		margin-bottom: 1rem;
	}
</style>
