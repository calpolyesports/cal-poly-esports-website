<script lang="ts">
	import AboutText from './AboutText.svelte';
	import type { WithStringId, Club } from '$lib/types';
	import ModalForm from '$lib/ModalForm.svelte';
	import type { ModalFieldDefinition } from '$lib/ModalForm.svelte';
	import ClubEventLink from './ClubEventLink.svelte';
	import type { PageData } from './$types';
	import { env } from '$env/dynamic/public';

	let { data }: { data: PageData } = $props();
	let club: WithStringId<Club> | undefined = $derived(data.club);

	let canEdit = $derived(Boolean(data.adminFor.find((admin) => admin.urlName === club?.urlName)));

	let editingAbout = $state(false);

	let addMemberModal: ModalForm | undefined = $state(undefined);

	let editMemberModal: ModalForm | undefined = $state(undefined);
	let selectedMemberId: string | undefined = $state(undefined);

	const memberModalFields = [
		{ id: 'name', name: 'Name', type: 'text', required: true },
		{ id: 'position', name: 'Position', type: 'text', required: true },
		{
			id: 'profileImage',
			name: 'Profile Image',
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
		addMemberModal?.clearFields();
		addMemberModal?.showModal();
	};

	const onClickEditMember = (id: string) => {
		if (!canEdit) return;
		const member = club?.boardMembers.find((m) => m.id === id);
		if (member) {
			selectedMemberId = id;
			editMemberModal?.fillFields({
				name: member.name,
				position: member.position
			});
			editMemberModal?.showModal();
		}
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
		<button class="button-medium" onclick={onSubmitEditAbout}>Save</button>
	{:else}
		{#if canEdit}
			<button class="button-medium space-above" onclick={onClickEditAbout}>Edit</button>
		{/if}
		<AboutText html={club.aboutHtml} />
	{/if}

	{#if club.events.length > 0}
		<div class="club-events">
			<h2>Events</h2>
			{#each club.events as event (event.name)}
				<ClubEventLink {event} />
			{/each}
		</div>
	{/if}

	{#if club.boardMembers.length > 0 || canEdit}
		<h2>Board Members</h2>
		{#if canEdit}
			<button class="button-medium" onclick={onClickAddMember}>Add Board Member</button>
		{/if}
		<ul class="board-members">
			{#each club.boardMembers as member, i (member.id)}
				<!-- TODO: no more svelte-ignore -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div role="button" tabindex={i} onclick={() => onClickEditMember(member.id)}>
					<li>
						{#if member.profileImage}
							<img src={member.profileImage} alt={member.name} />
						{:else}
							<img src={env.PUBLIC_DEFAULT_PROFILE_IMAGE} alt={member.name} />
						{/if}
						<p class="bolded">{member.name}</p>
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
			actions={[{ name: 'Submit', action: `/clubs/${club?.urlName}/board?/create` }]}
		/>

		<ModalForm
			bind:this={editMemberModal}
			title="Edit Board Member"
			fields={memberModalFields}
			extraInfo={selectedMemberId
				? {
						id: selectedMemberId
					}
				: undefined}
			actions={[
				{ name: 'Submit', action: `/clubs/${club?.urlName}/board?/edit` },
				{ name: 'Delete', action: `/clubs/${club?.urlName}/board?/delete` }
			]}
		/>
	{/if}
{:else}
	<h1>404</h1>
	<p>Club does not exist</p>
{/if}

<style>
	h1 {
		font-family: var(--font-display);
		text-align: center;
		font-size: var(--font-size-2xl);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-lg);
		position: relative;
		padding-bottom: 0.75rem;
	}

	h1::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 3px;
		background: var(--cal-poly-secondary);
	}

	h2 {
		font-family: var(--font-display);
		text-align: center;
		font-size: var(--font-size-xl);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-md);
		position: relative;
		padding-bottom: 0.75rem;
	}

	h2::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40px;
		height: 3px;
		background: var(--cal-poly-secondary);
	}

	.space-above {
		margin-top: 2rem;
	}

	.bolded {
		font-weight: bold;
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
		box-shadow: var(--shadow-sm);
		border: 3px solid var(--cal-poly-primary);
	}

	ul.board-members li p {
		font-size: 1.2rem;
		margin: 0.2rem 0;
		line-height: 1.2rem;
		text-align: center;
	}

	textarea {
		width: 50rem;
		height: 20rem;
		margin-bottom: 1rem;
	}
</style>
