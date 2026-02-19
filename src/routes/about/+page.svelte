<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="about-content">
	<h1>About</h1>
	<p>
		Cal Poly Esports is a student-run organization that aims to provide competitive, casual, and
		social environments for students interested in video games. We work with a number of gaming clubs
		on campus to help coordinate and sponsor casual events, competitive tournaments, and more. Our
		goal is to create a community where students can come together to play games, make friends, and
		have fun.
	</p>
	<h2>Our Mission</h2>
	<p>
		Our mission is to provide a space for students to come together and share their passion for video
		games. We strive to create a welcoming and inclusive community where students can connect with
		others who share their interests. We believe that video games have the power to bring people
		together and create lasting friendships. Our goal is to foster a sense of community and belonging
		among students who love to play games.
	</p>
	<h2>Our Values</h2>
	<p>
		At Cal Poly Esports, we value inclusivity, diversity, and respect. We believe that everyone should
		have the opportunity to participate in our events and feel welcome in our community. We are
		committed to creating a safe and supportive environment for all students, regardless of their
		background or experience level. We believe that everyone has something valuable to contribute and
		that we are stronger when we come together as a community.
	</p>
	<h2>Get Involved</h2>
	<p>
		If you are interested in joining Cal Poly Esports, we encourage you to attend one of our events or
		meetings. If you can't make it, then join <a href={resolve('/discord')} target="_blank"
			>our Discord server</a
		> instead! You can also follow us on social media to stay up to date on our latest news and announcements.
		We are always looking for new members to join our community and help us grow. Whether you are a casual
		or competitive player, we welcome you to come and be a part of Cal Poly Esports!
	</p>
</div>

<style>
	.about-content {
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		font-family: var(--font-display);
		font-size: var(--font-size-2xl);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: bold;
		margin: var(--space-md) 0;
		text-align: center;
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
		font-size: var(--font-size-xl);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: bold;
		margin: var(--space-xl) 0 var(--space-md);
		text-align: center;
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

	p {
		font-size: var(--font-size-md);
		line-height: 1.7;
		margin: var(--space-lg) 0;
		text-align: left;
		color: var(--text-secondary);
	}

	a {
		color: var(--cal-poly-secondary);
	}
</style>
