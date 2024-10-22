let btn = document.querySelector(".btn");
let con = document.querySelector(".con");
let x = 0;
let valu = document.querySelector("#inp");
let ring = document.querySelector(".ring");

async function query(url) {
  return await axios.get(url);
}

async function Main() {
  if (x == -1) {
    con.innerText = "";
  }
  try {
    let val = valu.value;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${val}`;
    let ans = await query(url);
    ring.classList.add("hide");
    // POS and deginations and snonyomus
    let mean = ans.data[0].meanings;
    for (i = 0; i < Object.keys(mean).length; i++) {
      let h1 = document.createElement("h1");
      h1.innerText = mean[i].partOfSpeech;
      con.appendChild(h1);
      for (def of mean[i].definitions) {
        let p = document.createElement("p");
        p.innerText = def.definition;
        con.appendChild(p);
      }

      // synonyms
      let ol = document.createElement("ol");
      let hsyn = document.createElement("h1");
      for (syn of mean[i].synonyms) {
        li = document.createElement("li");
        li.innerText = syn;
        ol.appendChild(li);
      }
      if (Object.keys(mean[i].synonyms).length > 0) {
        hsyn.innerText = "synonyms";
        con.appendChild(hsyn);
        con.appendChild(ol);
      }
    }

    // Pronunciations
    let haud = document.createElement("h1");
    haud.innerText = "pronunciations";

    let aud = ans.data[0].phonetics;
    if (aud.length > 0) {
      con.appendChild(haud);
    }
    for (a of aud) {
      let voice = document.createElement("div");
      voice.innerHTML = `<audio controls src="${a.audio}"></audio>`;
      con.appendChild(voice);
    }

    // Sources
    let srcp = document.createElement("p");
    srcp.innerHTML = `<a  class ="source_link" href="${ans.data[0].sourceUrls[0]}" >Source's</a> `;
    con.append(srcp);
    x = -1;
  } catch {
    let err = document.createElement("h2");
    ring.classList.add("hide");
    err.innerText = "Bad Request Plaese Try Again With Another Word";
    con.appendChild(err);
    setTimeout(() => {
      con.removeChild(err);
    }, 4000);
  }
}

btn.addEventListener("click", async () => {
  ring.classList.remove("hide");
  await Main();
});

valu.addEventListener("keyup", async (ev) => {
  if (ev.key == "Enter") {
    ring.classList.remove("hide");
    await Main();
  }
});
