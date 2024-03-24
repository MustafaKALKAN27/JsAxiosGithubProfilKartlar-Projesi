const API_URL = 'https://api.github.com/users/'

const form = document.getElementById('form')
const search = document.getElementById('search')
const main = document.getElementById('main')

async function getUser(username) {
  try {
    const { data } = await axios(API_URL + username)

    //console.log(data)
    createUserCard(data)
    getRepos(username)
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard('Ardığınız kullanıcı bulunamadı :(')
    }
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const user = search.value

  if (user) {
    getUser(user)

    search.value = ''
  }
})

function createUserCard(user) {
  const userName = user.name || user.login
  const userBio = user.bio ? `<p>${user.bio}</p>` : ''

  const cardHTML = `

  <div class="card">
  <img
    class="user-image"
    src="${user.avatar_url}"
    alt="${user.name}"
  />

  <div class="user-info">
    <div class="user-name">
      <h2>${userName}</h2>
      <small>@${user.login}</small>
    </div>
  </div>

  <p>
    ${userBio}
  </p>

  <ul>
    <li>
      <i class="fa-solid fa-user-group"></i> ${user.followers}
      <strong>Followers</strong>
    </li>
    <li> ${user.following} <strong>Following</strong></li>
    <li>
      <i class="fa-solid fa-bookmark"></i> ${user.public_repos} <strong>Repository</strong>
    </li>
  </ul>

  <div class="repos" id="repos"></div>
</div>
  
  `

  main.innerHTML = cardHTML
}

function createErrorCard(msg) {
  const cardErrorHTML = `
  
  <div class="card">
  <h2> ${msg} </h2>
  </div>

  `

  main.innerHTML = cardErrorHTML
}

async function getRepos(username) {
  try {
    const { data } = await axios(API_URL + username + '/repos')

    addReposToCard(data)
  } catch (err) {
    createErrorCard('Repoları çekerken hata oluştu.')
  }
}

function addReposToCard(repos) {
  //repos classına sahip div etiketini reposEl değişkenine aktar
  const reposEl = document.getElementById('repos')
  //github tan çekilen repoları başlagınçtan itbaren 3 tanesi sırasıyla al
  repos.slice(0, 3).forEach((repo) => {
    //reposLink değişkenine a etiketi oluşturup aktar
    const reposLink = document.createElement('a')
    //oluşturduğumuz a etiketinin hrefine sırasıyla gelen repoların url sini aktar
    reposLink.href = repo.html_url
    //a etiketinin tıklanmasını _blank yap
    //reposLink.target = '_blank'
    //a etikenin içine backtik lerin içindeki html kodlarını ekle 
    reposLink.innerHTML = ` <i class="fa-solid fa-book-bookmark"></i> ${repo.name} `
    //oluşturulan a etiketini appenChild ile div etiketinin altına çokuk node olarak ekle
    reposEl.appendChild(reposLink)
  })
}