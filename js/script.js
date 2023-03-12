let submit = document.querySelector('input[type="submit"]')

submit.addEventListener('click', async function (e) {
    e.preventDefault()
    let inputValue = document.querySelector('input[type="text"]').value

    if (inputValue == '' || inputValue.length < 3) {
        alert('Количество символов должно быть больше 3')
    } else {
        document.querySelector('hr').style.display = 'block'
        let url = `https://api.github.com/search/repositories?q=${inputValue}+sort=stars&order=desc`

        await fetch(url)
            .then(res => res.json())
            .then(data => displayResult(data))

        function displayDescription(desc) {
            return desc.includes('DOCTYPE html') ?
                'HTML document' :
                desc.length > 400 ?
                    desc.slice(0, 400) + '...' : desc
        }

        function displayResult(data) {
            let content = ''
            let totalCount = data.total_count > 10 ? 10 : data.total_count

            if (totalCount == 0) {
                content += '<h2>Ничего не найдено...</h2>'
            } else {
                content += `<h2>Найдено совпадений: ${data.total_count}</h2>`

                for (let i = 0; i < totalCount; i++) {
                    content += `
                    <li class="result__item">
                        <a class="left"
                            target="_blank"
                            href="${data.items[i].owner.html_url}" 
                        >
                            <img src="${data.items[i].owner.avatar_url}">
                            <span 
                                class="repo__owner">
                                ${data.items[i].owner.login}
                            </span>
                        </a>
                        
                        <div class="right">
                            <a target="_blank" 
                                href="${data.items[i].html_url}" 
                                class="repo__name">
                                ${data.items[i].name} 
                            </a>
                            <div class="repo__desc">
                                <p>
                                    ${displayDescription(data.items[i].description)}
                                </p>
                            </div >
                        </div>
                    </li> `
                }
            }
            document.querySelector('.results').innerHTML = content
        }
    }
})