# Git and GitHub Explained

This is a beginner-friendly explanation of Git and GitHub for someone new to these tools.

## What is Git?

Git is a tool that keeps track of changes to files over time.

Imagine you are working on a document and you want to keep a history of every change.
Git lets you do that for code and files.

### Key ideas in Git

- **Repository (repo)**: a folder of files that Git watches.
- **Commit**: a saved snapshot of the files at one moment.
- **Branch**: a separate line of work inside the same repo.
- **Status**: shows which files changed but are not yet saved.
- **Remote**: a copy of the repo stored on another machine, usually on GitHub.

## What is GitHub?

GitHub is a website that stores Git repositories online.

It lets you:
- save your code in the cloud,
- share it with others,
- keep a backup,
- and work together on the same repo.

GitHub is not Git itself, but it works with Git.

## How Git works in practice

### 1. `git init`

This command starts Git in a folder.
It makes the folder a Git repository.

Example:
```bash
cd '/Users/wyattehr/Developer/Third Space'
git init
```

### 2. `git status`

This shows what changed since the last commit.

It tells you:
- which files are new,
- which files are modified,
- and which files are ready to be committed.

Example:
```bash
git status
```

### 3. `git add`

This tells Git which changes you want to save next.
Think of it as putting files into a draft box.

Example:
```bash
git add .
```

This means "add all changes in the current folder." 

### 4. `git commit`

This saves a snapshot of the files you added.
A commit is like a checkpoint.

Example:
```bash
git commit -m 'Describe what changed'
```

### 5. `git log`

This shows the history of commits.
Each commit has a message and a date.

Example:
```bash
git log --oneline
```

## Working with GitHub

### Remote repository

A remote repository is the copy of your repo on GitHub.

When you clone a repo from GitHub, you get a copy on your computer.
When you push, you send your local commits to GitHub.

### 6. `git remote add origin`

This connects your local repo to the GitHub repo.

Example:
```bash
git remote add origin https://github.com/wyattehr/third-space.git
```

### 7. `git push`

This sends your local commits to GitHub.

Example:
```bash
git push origin main
```

`origin` is the name of the remote, and `main` is the branch.

### 8. `git pull`

This brings changes from GitHub into your local repo.

Example:
```bash
git pull origin main
```

This is useful if someone else changed the repo, or if you changed it from another machine.

## What we did today with Git and GitHub

- We made changes in the local repo.
- We committed those changes with a message.
- We tried to push them to GitHub.
- GitHub rejected the push because the authentication token did not allow workflow file changes.
- Then we refreshed authentication with GitHub CLI and pushed successfully.

## Important Git concepts for you

### Working directory

This is your actual folder with files.
You edit files here.

### Staging area

This is Git’s draft box.
After `git add`, the changes are staged for the next commit.

### Commit history

This is the list of saved snapshots.
Each commit records what changed and when.

### Branch

A branch is a separate path of development.
Most of the time, you work on `main`.

### Remote and push

A remote is the version of the repo on GitHub.
`git push` sends your commits there.

### Pull request (PR)

A pull request is a GitHub feature used to review and merge changes.
We have not used it here, but it is common when multiple people work together.

## Useful commands summary

- `git status` — see what changed
- `git add .` — stage all changes
- `git commit -m 'message'` — save a snapshot
- `git log --oneline` — see commit history
- `git push origin main` — send commits to GitHub
- `git pull origin main` — get updates from GitHub

## Why Git is useful

Git helps you keep a history of your work.
If something breaks, you can go back to an earlier state.
It also makes sharing code safer, because Git records exactly what changed.

## Why GitHub is useful

GitHub gives you a remote backup of your repo.
It also lets you see your work through a browser and share it with others.

If you want, I can also add a short “cheat sheet” page with only the most important Git commands and what they mean. 
