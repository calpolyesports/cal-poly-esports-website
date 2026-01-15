<script lang="ts">
	import EventCalendar from '$lib/EventCalendar.svelte';
	import type { ModalEvent } from '$lib/EventCalendar.svelte';
	import type { WithStringId, Event } from '$lib/types.js';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	//////////////////////
	// API INTERACTIONS //
	//////////////////////

	const sendAddEvent = async (event: ModalEvent): Promise<WithStringId<Event> | undefined> => {
		const response = await fetch('/calendar', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(event)
		});

		if (response.ok) {
			const data = await response.json();
			return data.event;
		}

		return undefined;
	};

	const sendUpdateEvent = async (
		id: string,
		event: ModalEvent
	): Promise<WithStringId<Event> | undefined> => {
		const response = await fetch(`/calendar/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(event)
		});

		if (response.ok) {
			const data = await response.json();
			return data.event;
		}

		return undefined;
	};

	const sendDeleteEvent = async (id: string): Promise<boolean> => {
		const response = await fetch(`/calendar/${id}`, {
			method: 'DELETE'
		});

		return response.ok;
	};
</script>

<div>
	<h1>Admin</h1>
</div>

<EventCalendar
	events={data.events}
	clubs={data.clubs}
	adminFor={data.adminFor}
	{sendAddEvent}
	{sendUpdateEvent}
	{sendDeleteEvent}
/>

<!-- Ethernet Availability Info in Table -->
<div class="ethernet-availability">
	<h3>ETHERNET AVAILABILITY:</h3>
	<table>
		<thead>
			<tr>
				<th>Monday</th>
				<th>Tuesday</th>
				<th>Wednesday</th>
				<th>Thursday</th>
				<th>Friday</th>
				<th>Saturday</th>
				<th>Sunday</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>5:30-midnight</td>
				<td>4:30-midnight</td>
				<td>5:30-midnight</td>
				<td>4:30-midnight</td>
				<td>2:00-midnight</td>
				<td>All-Day</td>
				<td>All-Day</td>
			</tr>
		</tbody>
	</table>
</div>

<div>
	<h2>Logged in as: {data.username}</h2>

	<form method="post" use:enhance>
		<button>Log out</button>
	</form>
</div>

<div>
	<h3>Clubs</h3>
	{#each data.adminFor as club (club._id)}
		<a href={resolve('/clubs/[slug]', { slug: club.urlName })}>{club.clubName}</a>
	{/each}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin: 1rem auto;
	}

	h1 {
		font-size: 3rem;
		font-weight: bold;
		margin-top: 1rem;
		text-align: center;
		text-decoration-line: underline;
		text-decoration-color: var(--cal-poly-secondary);
		text-decoration-thickness: 0.2rem;
		text-underline-offset: 2rem;
	}

	h2 {
		font-size: 2rem;
		font-weight: bold;
		margin-top: 1rem;
	}

	h3 {
		font-size: 1.5rem;
		font-weight: bold;
		margin: 0;
		color: var(--cal-poly-secondary);
	}

	a {
		font-size: 1.25rem;
		margin: 0;
		color: black;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	button {
		font-size: 1.25rem;
		margin-bottom: 2rem;
		padding: 0.5rem 1rem;
		background-color: var(--cal-poly-secondary);
		color: white;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
	}

	.ethernet-availability {
		text-align: center;
	}

	.ethernet-availability h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: var(--cal-poly-secondary);
	}

	.ethernet-availability table {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		border-collapse: collapse;
		font-size: 1.25rem;
	}

	.ethernet-availability th,
	.ethernet-availability td {
		border: 1px solid #ccc;
		padding: 0.5rem;
		text-align: center;
	}

	.ethernet-availability th {
		background-color: var(--cal-poly-secondary);
		color: white;
		font-weight: bold;
	}

	.ethernet-availability td {
		background-color: #f9f9f9;
	}
</style>
