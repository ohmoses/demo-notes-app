# Demo Notes App

This is a toy project with a dual purpose:

- Get my hands on tech I haven't had the chance to try out at work: React Hooks, TypeScript, and Apollo/GraphQL;
- Have a fresh code sample available.

I wanted to stay very limited in scope and not set up a real backend, so the backend is mocked in the frontend code with `apollo-link-schema`. I also added a simulated latency of 300 ms to make the optimistic UI updates clear.

## Notes

- If I didn't pay attention, I could work on this for an [infinite amount of time](https://en.wikipedia.org/wiki/Parkinson%27s_law), so I necessarily had to decide one day to push the unfinished work and get on with it. This is supposed to be a representative code sample, so I want to make that explicit—there are a few places where tooltips would help, there are clickable divs which should be buttons, there are no css transitions, adding a tag of maximum length to a note breaks the layout… It's not that I don't care about UI/UX details, it's that I feel there's more value right now in actually sending out job applications than additional improvements and fixes.
- Typing GraphQL functions with `graphql-codegen` is sometimes tricky: dates are sent to the server as `Date`, but come back as `string`. (This would typically not be a problem if you're not mocking the server on the frontend and generating the same types for both.) Optional fields in input types are typed as `T | null | undefined` (rather than either of the two), which makes turning on strict TypeScript checking slightly too much work at the moment.
- Re: `src/view/useCreate{Note,Tag}.ts`—seems like quite an obvious use case for hooks, but it took me [a couple of iterations](https://github.com/ohmoses/demo-notes-app/commit/bf104a9db443e6e93384b42f268f770962a81b1f) to start "thinking in hooks" and stop thinking in HOCs and similar patterns. Reminds me of the time when I first moved from React to Vue and tried to abstract component behavior using HOCs, before I learned the _tao_ of Vue (`extends` and `mixins`).
- I clearly haven't yet gotten the knack of designing GraphQL schemas, but I made some progress from not knowing anything. For example, it seems that returning _everything that's been touched_ in mutation payloads makes UI updates easier for the client. On the other hand, if I need to perform an action on the client either only on the _optimistic_ update or only on the _real_ update, I haven't found a better way of discerning the two than literally returning a boolean `optimistic` from the mutation. Feels wrong.
- When I first encountered `react-apollo`, the idea of mixing data-fetching code into the JSX didn't sit right with me at all. I was very happy to find that `react-apollo-hooks` exists.
- Because I'm mocking the backend, I ship hundreds of kilobytes of graphql libs to the client, which means I didn't really feel the need to pay attention to the size of the rest of the bundle. Ordinarily, if I was coding something for real, I would choose Svelte or Preact and pay closer attention to dependencies.
