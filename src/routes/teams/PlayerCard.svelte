<script lang="ts">
    import * as types from '$lib/types';

    export let player: types.RosterMember;
</script>

<div class="player-card">
    {#if player.picture}
    <div class="picture-container">
        <img src={player.picture} alt={player.username} />
    </div>
    {/if}
    <div class="bottom-shadow"></div>
    <div class="text">
        <p>{player.name}</p>
        <h1>{player.username}</h1>
        <h2>{player.role}</h2>
    </div>
</div>

<style>
    div.player-card {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 20rem;
        width: 15rem;
        overflow: hidden;
        background-color: var(--neutral-bright);
        border-radius: 1rem;
        padding: 1rem;
        margin: 1rem;
        color: var(--neutral-bright);
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    }

    div.picture-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    div.picture-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
    }

    div.bottom-shadow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
        z-index: 0;
    }

    div.text {
        position: relative;
        z-index: 1;
        text-align: center;
    }

    h1, h2, p {
        margin: 0;
    }
</style>
