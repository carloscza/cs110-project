#### cs110-project

# Trackboxd

## Setup

1. Clone the repository.

```
git clone https://github.com/carloscza/cs110-project.git

```

2. Get Remote Branches (Optional)

```
cd cs110-project

# Fetch all remote branches
git fetch origin

# See all branches (local and remote)
git branch -a

# Create a local branch that tracks the remote branch
git checkout -b branch-name origin/branch-name

# Verify branch you are on
git branch

#Update branch
git pull

```

3. Setup

```
# Go to root directory
cd cs110-project

# Run setup bash script
bash setup.sh

```

4. Create .env in backend directory

```
# From project root directory
cd backend

# Create a .env file with the following:
MONGODB_URI=your_connection_string
DB_NAME=trackboxdDB
PORT=3001
```

5. Run backend

```
# From project root directory
cd backend

# Run backend run (leave ternimal open and running)
node index.js
```


6. Run frontend

```
# Open a new terminla.

# From project root directory
cd frontend

# Run backend run (leave ternimal open and running)
npm start

```

