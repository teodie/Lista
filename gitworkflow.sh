# First create a branch of the plan feature or update
git branch feature-Branch
git branch    # Checking if the branch is created 


# Trasfer to the branch to start working on it
git checkout feature-Branch
git branch  # Checking if your in the right branch

# Work on the branch and update the coded needed 
git add -A  # put the updated file into staging
git commit -m "Description of the changes"  # Commit files on the staging

# Push the branch to the remote repository for unit testing
git push -u origin feature-Branch
git branch -a # Checking local and remote branch

# Merge the feature branch to the main branch
git checkout main    # Move to your main branch
git branch --merged  # Check all the branches that is merged to the main branch
git merge feature-Branch # Merge the feature branch to Local main branch

# Push the main branch to the local Repo
git pull origin main  # Get all the latest update on the remote main branch
git push origin main # Push the updated branch to the remote main brach

# Deleting the feature branch for local and remote Repo
git branch -d feature-Branch  # Delete for local branch 
git push origin --delete feature-Branch # Delete the remote branch