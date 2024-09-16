<script lang="ts">
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import AboutText from './AboutText.svelte';
	import type { WithStringId, Club, BoardMember } from '$lib/types';
    import ModalForm from '$lib/ModalForm.svelte';
    import type { ModalFieldDefinition, FilledModalFields } from '$lib/ModalForm.svelte';

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
    let addMemberModalVisible = false;

    let editMemberModal: ModalForm;
    let editMemberModalVisible = false;
    let selectedMemberIndex: number | undefined;

    let selectedFile: File | null = null;

    const memberModalFields = [
        { name: 'name', type: 'text' },
        { name: 'position', type: 'text' },
        { name: 'profileImage', type: 'file', accept:".jpg, .jpeg, .png, .webp" },
    ] as ModalFieldDefinition[];

    //////////////////////
    // API INTERACTIONS //
    //////////////////////

    const sendSaveAbout = async (updatedClub: Club) => {
        const response = await fetch(`/clubs/${updatedClub.urlName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ aboutText: updatedClub.aboutText }),
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
            method: 'DELETE',
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
    }

    const onClickAddMember = () => {
        addMemberModal.clearFields();
        addMemberModalVisible = true;
    };

    const onSubmitAddMember = async (fields: FilledModalFields) => {
        if (club) {
            const formData = new FormData
            formData.append('name', fields.name);
            formData.append('position', fields.position);
            if (selectedFile) {
                formData.append('profileImage', selectedFile);
            }

            const member = await sendAddMember(club, formData);
            if (member) {
                club.boardMembers = [...club.boardMembers, member];
                addMemberModalVisible = false;
            }
        }

        selectedFile = null;
    };

    const onClickEditMember = (index: number) => {
        if (!canEdit) return;
        const member = club?.boardMembers[index];
        if (member) {
            selectedMemberIndex = index;
            editMemberModal.fillFields({
                name: member.name,
                position: member.position,
            });
            editMemberModalVisible = true;
        }
    };

    const onSubmitEditMember = async (fields: FilledModalFields) => {
        if (club && selectedMemberIndex !== undefined) {
            const formData = new FormData();
            formData.append('name', fields.name);
            formData.append('position', fields.position);
            if (selectedFile) {
                formData.append('profileImage', selectedFile);
            }
            const member = await sendUpdateMember(club, selectedMemberIndex, formData);
            if (member) {
                club.boardMembers = club.boardMembers.map((m, i) => i === selectedMemberIndex ? member : m);
                editMemberModalVisible = false;
            }
        }

        selectedFile = null;
    };

    const onSubmitDeleteMember = async () => {
        if (club && selectedMemberIndex !== undefined) {
            const deleted = await sendDeleteMember(club, selectedMemberIndex);
            if (deleted) {
                club.boardMembers = club.boardMembers.filter((_, i) => i !== selectedMemberIndex);
                editMemberModalVisible = false;
            }
        }

        selectedFile = null;
    };

    const onFileChange = (event: CustomEvent) => {
        const { file } = event.detail;

        if (file) {
            selectedFile = file;
        } else {
            console.error("File selection is invalid");
        }
    };
</script>

{#if club}
    <h1>{club.clubName} Club</h1>
    {#if canEdit && editingAbout}
        <textarea bind:value={club.aboutText}></textarea>
        <button class="button-medium" on:click={onSubmitEditAbout}>Save</button>
    {:else}
        {#if canEdit}
            <br>
            <button class="button-medium" on:click={onClickEditAbout}>Edit</button>
        {/if}
        <AboutText html={club.aboutHtml} />
    {/if}

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

    {#if canEdit}
        <ModalForm
            bind:this={addMemberModal}
            bind:show={addMemberModalVisible}
            title="Add Board Member"
            fields={memberModalFields}
            actions={[
                { name: 'Submit', callback: onSubmitAddMember },
            ]} 
            on:fileChange={onFileChange}
        />

        <ModalForm
            bind:this={editMemberModal}
            bind:show={editMemberModalVisible}
            title="Edit Board Member"
            fields={memberModalFields}
            actions={[
                { name: 'Submit', callback: onSubmitEditMember },
                { name: 'Delete', callback: onSubmitDeleteMember },
            ]} 
            on:fileChange={onFileChange}
        />
    {/if}
{:else}
    <h1>404</h1>
    <p>Club does not exist</p>
{/if}

<style>
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        text-decoration-line: underline;
        text-decoration-color: var(--cal-poly-secondary);
        text-decoration-thickness: 0.2rem;
        text-underline-offset: 2rem;
    }

    p {
        font-size: 1.5rem;
        margin-bottom: 2rem;
    }

    ul.board-members {
        list-style: none;
        padding: 0;
        display: flex;
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
