let input = document.querySelector("#input");
let searchBtn = document.querySelector("#search");
let notFound = document.querySelector(".not-found");
let defBox = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");

searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    //clear data
    audioBox.innerHTML = "";
    notFound.innerText = "";
    defBox.innerText = "";
    //get t input data
    let word = input.value;

    // call API to get data
    if (!word) {
        alert('Word is required!');
        return;
    }

    getData(word);
})

async function getData(word) {
    loading.style.display = "block";
    // Ajax call
    // let url = "https://dictionaryapi.com/api/v3/references/learners/json/" + word + "?key=e1861da8-55ef-4aea-902f-765deaef2424"
    // console.log(`https://dictionaryapi.com/api/v3/references/learners/json/` + word + `?key=e1861da8-55ef-4aea-902f-765deaef2424`)
    const response = await fetch(`https://dictionaryapi.com/api/v3/references/learners/json/` + word + `?key=e1861da8-55ef-4aea-902f-765deaef2424`);
    var data = await response.json();
    // console.log(data)
    if (!data.length) {
        loading.style.display = "none";
        notFound.innerHTML = "Not found result!";
        // notFound.getElementsByClassName.display = "block";
    }
    //if result is suggestions
    if (typeof data[0] == 'string') {
        loading.style.display = "none";
        let heading = document.createElement('h3');
        heading.innerText = "Did you mean?";
        notFound.appendChild(heading);

        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = element;
            notFound.appendChild(suggestion);
        });
    }
    //result found
    loading.style.display = "none";
    let definition = data[0].shortdef[0];

    defBox.innerHTML = definition;
    defBox.style.display = "block";
    //sound
    const soundName = data[0].hwi.prs[0].sound.audio;
    if (soundName) {
        renderSound(soundName);
    }
}

function renderSound(soundName) {
    // https://media.merriam-webster.com/soundc11
    // https://media.merriam-webster.com/audio/prons/[language_code]/[country_code]/[format]/[subdirectory]/[base filename].[format]
    let subfolder = soundName.charAt(0);
    // console.log(`https://media.merriam-webster.com/audio/prons/en/us/wav/` + subfolder + `/` + soundName + `.wav?key==e1861da8-55ef-4aea-902f-765deaef2424`)
    let soundSrc = `https://media.merriam-webster.com/audio/prons/en/us/wav/` + subfolder + `/` + soundName + `.wav?key==e1861da8-55ef-4aea-902f-765deaef2424`;

    let aud = document.createElement("audio");
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);
}