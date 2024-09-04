<script lang="ts">
    export let show = false;
    export let title = '';
</script>

<div class="modal" style="display: {show ? 'flex' : 'none'}">
    <div class="modal-content">
        <button class="close" on:click={() => show = false}>&times;</button>
        <h2>{title}</h2>
        <slot></slot>
    </div>
</div>

<style>
    .modal {
        display: none;
        justify-content: center;
        align-items: center;
        position: fixed;
        z-index: 1;
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

    .close {
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
</style>
