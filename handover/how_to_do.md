# Responsibilities and How-To Guide

---
This note covers the list of your tasks/responsibilities, as well as step-by-step instructions on how to do them.

**Note:** IT Reps are responsible for the maintenance and update of this documentation.

\[Last updated - 09/2026]

---

# Task List

| Task                                                | Frequency                                                      | How To Do                                 |
|-----------------------------------------------------|----------------------------------------------------------------|-------------------------------------------|
| Update the Committee page                           | On handover                                                    | [See 1.](#1-update-the-committee-page)    |
| Update the `variables.yml` file                     | On handover (and whenever clubnight prices are set)            | [See 2.](#2-update-the-variablesyml-file) |
| Update the Clubnight page                           | Ad hoc - whenever clubnight rules change                       | [See 3.](#3-update-the-clubnight-page)    |
| Update the Varsity Page                             | On handover (should occur after varsity)                       | [See 4.](#4-update-the-varsity-page)      |
| Update the Latest News Page <br>(i.e., make a post) | Ad hoc - whenever you need to make a post (e.g., about trials) | [See 5.](#5-update-the-latest-news-page)  |
| Add New Pages                                       | Ad hoc                                                         | [See 6.](#6-add-new-pages)                |

---
### 0. General Instructions
**Description:** When updating the repo, please always do the below steps to avoid any issues (all step-by-step instructions following this section will now assume you do these steps).

**<u>Before doing anything</u>:**
1. Do a `git pull` to ensure you have the latest files.

**<u>Before submitting your changes to the repo</u>:**
1. Run the command `bundle exec jekyll serve` to spin up a local version of the website.
2. Browse to [http://localhost:4000](http://localhost:4000) to see the changes before you push them to GitHub.
3. If changes are good, push them to GitHub (using whatever git commands you prefer). I just use the standard:
   1. `git add -u` to add the updated file for commit.
   2. `git commit -m "Updated XYZ page"` to commit the changes.
   3. `git push` to push the changes to the GitHub repo.


---

### 1. Update the Committee Page
**Description:** After the new OUBaC committee has been selected, you should update the website to reflect the new members. You should also update the `variables.yml` file (see [2.](#2-update-the-variables-yml-file)).

**Note:** Traditionally:

- The descriptions for the new members (see the website for reference) are written by their respective predecessors.
- You can ask the new members for the pictures they would like to display. `.jpg` format seems to be the historical preference.

If you cannot obtain the above two things (photo + description) from the predecessor/successor, you may need to fill in the description yourself and/or source a photo from their Facebook.

**Step-by-step instructions:**

1. Access the `the-committee` directory (`assets/the-committee`).
2. Create a new directory for the current year and upload all member profile pics.
3. Access the `committee` directory (`_data/committee`).
4. Create a new `YYYY.yml` file for the current year and update all information as required.

---

### 2. Update the `variables.yml` file

**Description:** The `variables.yml` file lists the President, IT Rep, Welfare Reps, and Secretary. These are used in various places over the website to auto-update to the current position holder. The relevant details need to be changed to the new committee members.

The clubnight prices are also detailed here, along with the clubnight reps. These need to be updated as well whenever those details are finalised.

**Step-by-step instructions:**

1. Access the `variables.yml` file (`_data/variables.yml`).
2. Make the required changes (update names, emails, and prices).


---

### 3. Update the Clubnight Page

**Description:** If required, the content of this page should be adjusted to reflect new rules, content, etc. Typically, the pres or Vice-Pres will provide the text or details that need to be updated.

**Note:** Some of the details (e.g. prices) are handled in the `variables.yml` file. [See 2.](#2-update-the-variablesyml-file)

**Step-by-step instructions:**

1. Access the `clubnight.html` page.
2. Make the required changes (usually just adjusting some of the bullet points).

---

### 4. Update the Varsity Page

**Description:** After Varsity, the website needs to be updated with the results. This requires the Varsity scoresheet, which someone from the previous committee should have.

**Step-by-step instructions:**

1. Access the `varsity` folder (`_data/varsity`).
2. Create a new `YYYY.yml` file.
3. Copy and paste the required fields from a previous year's file, then make the required changes to update the results.

---

### 5. Update the Latest News Page

**Description:** The "Latest News" bar on the homepage displays the three most recent entries from the `_posts` folder in the repository. To update it, simply create new posts as necessary.

**Note:** You can create a post about anything, but at a minimum, you should usually create:

1. A post linking to the current year's Clubnight details. You can generally copy a previous year's post and update the year and any relevant details. Tbh, I have created a general post that links to the `Clubnight` page anyway, so you can just update the `last updated` part of  `clubnight.html` just to let people know it is up to date.
2. A post about squad trials. This is usually posted once you have the link to the signup sheet, around the start of Michaelmas Term (MT). Same as (1), I have created a general trials post that links to the `squad-trials` page. Again, just updating the `last updated` part of `squad-trials.html` should be sufficient.
3. A post about the Freshers' Fair. It is worth posting this each year in case people are unable to attend. Same as (1) and (2), I've created a general post pointing to the `freshers-fair.html` page. Just keep this page updated instead.

**Step-by-step instructions:**

1. Access the `_posts` folder.
2. Create a new `YYYY-MM-DD-[name].html` file.
   1. Copy and paste from previous posts as necessary, then update the dates, links, and other relevant details.

---

### 6. Add New Pages

**Description:** If you need to add new tabs or pages to the website, you can follow the steps below. This should not need to be done very often. Please obtain permission from the President before making these changes.

### To add a new tab to the homepage

1. Access the `_includes` folder.
2. **IMPORTANT:** You will need to replicate the changes across both `top-nav.html` and `side-nav.html` so that the changes appear on both the desktop and mobile versions of the website.
3. Copy and paste an existing navigation item to ensure the formatting remains consistent with the others. Update the name of the tab as required.
4. Update the relevant `href` links and create the required page(s). See below on creating new pages.

### To add a new page

1. Create a new `.html` file in the main directory as required.
2. Copy and paste the HTML from an existing page that uses the formatting you need.
3. Update and complete the page as required.
4. Update any relevant `href` links (e.g., in any homepage tabs/posts).
