document.addEventListener('DOMContentLoaded', () => {
  // Select input form
  let form = document.querySelector('form')

  // grab repo/user list from DOM
  let userList = document.getElementById('user-list')
  let reposList = document.getElementById('repos-list')

  // adding submit event listener
  form.addEventListener('submit', (e) => {
    // prevent refresh
    e.preventDefault()

    // grab search term from form
    // apparently, without the querySelector, the names of the inputs are taken so all 3 show up with
    // form.search
    let searchTerm = e.target.querySelector('#search').value

    // Here we're checking if the radio buttons for username search or repo search is activated and
    // calling appropriate functions
    if (form.userRadio.checked === true) {
      getUsers(searchTerm)

    } else if (form.repoRadio.checked === true) {
      getRepos(searchTerm)
    }

  })


  // get users through by fetching from GitHub api function
  function getUsers(searchTerm) {
    // adding headers
    let reqConfig = {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    }
    //we fetch
    fetch(`https://api.github.com/search/users?q=${searchTerm}`, reqConfig)
      .then(res => res.json())
      .then(data => {
        // calling displayUsersData function on data
        displayUsersData(data)
        //Add Event Listeners to Elements
      }).catch(err => {
        console.log(err)
      })
  }


  // display data on page
  function displayUsersData(data) {
    // clear list before adding new items
    userList.innerHTML = '';
    reposList.innerHTML = '';
    // adding item data to variable
    const users = data.items
    // Here we are iterating each item in this case is a different user
    users.forEach(user => {
      // create li
      const li = document.createElement('li')

      // doing the very unsafe innerHTML
      li.innerHTML = `
      <a class="userRepoURL">
      <img class="avatar" src="${user.avatar_url}">
      <div class="username">${user.login}</div>
      </a>
      <span>
      <a class="user_url" href="${user.html_url}">view on github</a>
      </span>
      `
      // appending li to userList
      userList.appendChild(li)
    }) // end of forEach Loop

    // Add Event listeners to username
    // select a tag with .userRepoURL class
    let repoReqURL = document.querySelectorAll('.userRepoURL')
    //iterating through all the a tags and adding event listeners
    repoReqURL.forEach(userURL => {
      userURL.addEventListener('click', (e) => {
        // select username from our iteration
        const username = e.target.parentNode.querySelector('.username').textContent
        // user username to search for Repos on Github
        getUserRepos(username)
      })
    })
  }

  // get repos through API
  function getUserRepos(username) {
    // we fetch from GitHub API
    fetch(`https://api.github.com/users/${username}/repos`)
      .then(res => res.json())
      .then(repos => {
        // we call display Repos passing it the username and repo data
        displayRepos(repos, username)
      })
      .catch(err => console.log(err))
  }

  // display Repos
  function displayRepos(repos, username) {
    // Clear repo list
    reposList.innerHTML = '';
    // adding A header to our repo list
    reposList.innerHTML = `
    <h2>Viewing ${username}'s Repos <span>Total ${repos.length}</span></h2>
    `;
    // iterating through out repo data
    repos.forEach(repo => {
      // create li
      const li = document.createElement('li')
      // change HTML
      li.innerHTML = `
      <a href="${repo.html_url}">${repo.full_name}</a>
      `
      // append to our repoList HTML
      reposList.appendChild(li)
    })
  }

  function getRepos(searchTerm) {
    //clear lists
    userList.innerHTML = '';
    reposList.innerHTML = '';
    let reqConfig = {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    }
    //Fetch from Github API
    fetch(`https://api.github.com/search/repositories?q=${searchTerm}`, reqConfig)
      .then(res => res.json())
      .then(reposData => {
        // extracting .items from reposData object
        let repos = reposData.items
        //clear list
        reposList.innerHTML = '';
        // add header for repos list
        reposList.innerHTML = `
          <h2>Searching "${searchTerm}" Repos <span>Total ${repos.length}</span></h2>
          `;
        // iterate through repo object
        repos.forEach(repo => {
          const li = document.createElement('li')
          li.innerHTML = `
        <a href="${repo.html_url}">${repo.full_name}</a>
        `
          reposList.appendChild(li)
        })
      })
      .catch(err => console.log(err))
  }
})

