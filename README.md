1. Within a GitHub action that runs whenever code is pushed.
This is the best spot because it catches bugs right away and before anything gets merged. I don’t have to remember to run tests manually, and it makes sure everything still works no matter who’s pushing code. It’s just a smoother and safer way to keep the project from breaking as we build.

2. No.
End-to-end tests are meant to test how the whole app behaves from the user's perspective, not individual functions. If I just want to see if a function returns the right result, I’d use a unit test instead. E2E testing is better for checking how everything works together, like clicking buttons, loading pages, or saving items.

3. Navigation mode checks how the site loads from start to finish. Kind of like watching a user open the page for the first time. It looks at performance, how fast things appear, and overall experience.
Snapshot mode just takes a screenshot of the current page and checks what’s there. It’s good for catching accessibility or layout issues, but it doesn’t test how the page loads or runs JavaScript.

4.
- Add a `<meta name="viewport">` tag
This helps the site scale correctly on smaller screens like phones. It also helps with accessibility and overall layout.
- Optimize the images
Some of the images are larger than they need to be, and they could be loaded in better formats like WebP. This would make the site load faster and boost the performance score.
- Preload the main product image
Lighthouse suggested that preloading the largest content image could save load time. Doing this would help the main content appear faster for users.





