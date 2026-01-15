<script lang="ts">
	let { channel, parentUrl }: { channel: string; parentUrl: string } = $props();
</script>

<iframe
	src="https://player.twitch.tv/?channel={channel}&parent={parentUrl}&muted=true"
	title="Twitch Embed"
	height="100%"
	width="100%"
	allowfullscreen
>
</iframe>
