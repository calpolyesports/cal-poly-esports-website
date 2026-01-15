<script lang="ts">
	import type { ClubEvent } from '$lib/types';

	let { event }: { event: ClubEvent } = $props();
</script>

<div class="club-event-link">
	<!-- TODO: link may not always be external -->
	<a rel="external" href={event.url}>
		<img src={event.image} alt={event.name} />
		<p>{event.name}</p>
	</a>
</div>

<style>
	.club-event-link {
		position: relative;
		width: 60%;
		height: 10rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	@media (max-width: 768px) {
		.club-event-link {
			width: 100%;
			height: 7rem;
		}
	}

	.club-event-link img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: 0.2s;
	}

	.club-event-link p {
		position: absolute;
		top: -55%;
		left: 0;
		width: 100%;
		height: 100%;
		font-weight: bolder;
		text-decoration: none;
		text-align: center;
		color: white;
		font-size: 6rem;
		text-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.8);
		transition: 0.2s;
		pointer-events: none;
	}

	@media (max-width: 768px) {
		.club-event-link p {
			top: -50%;
			font-size: 4rem;
		}
	}

	.club-event-link img:hover {
		transform: scale(1.05);
	}

	.club-event-link img:hover + p {
		transform: scale(1.1);
	}
</style>
