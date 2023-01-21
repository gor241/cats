const popupLinks = document.querySelectorAll('.popup-link')
const body = document.querySelector('body')
const lockPadding = document.querySelectorAll('.lock-padding')
let unlock = true
const timeout = 800
if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '')
			const curentPopup = document.getElementById(popupName)
			popupOpen(curentPopup)
			e.preventDefault()
		})
	}
}
const popupCloseIcon = document.querySelectorAll('.close-popup')
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'))
			e.preventDefault()
		})
	}
}
function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open')
		if (popupActive) {
			popupClose(popupActive, false)
		} else {
			bodyLock()
		}
		curentPopup.classList.add('open')
		curentPopup.addEventListener('click', function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'))
			}
		})
	}
}
function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open')
		if (doUnlock) {
			bodyUnlock()
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + "px"
	if (lockPadding.length > 0) {
		for (let i = 0; i < lockPadding.length; i++) {
			const el = lockPadding[i]
			el.style.paddingRight = lockPaddingValue
		}
	}
	body.style.paddingRight = lockPaddingValue
	body.classList.add('lock')

	unlock = false
	setTimeout(function () {
		unlock = true
	}, timeout)
}
function bodyUnlock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = "0px"
			}
		}
		body.style.paddingRight = '0px'
		body.classList.remove('lock')
	}, timeout)
	unlock = false
	setTimeout(function () {
		unlock = true
	}, timeout)
}
document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup.open')
		popupClose(popupActive)
	}
})



const checkbox = document.querySelector(".popup__pet");
const checkboxParent = document.querySelector('.popup__checkbox')

checkboxParent.addEventListener('click', function () {
	if (checkbox.checked == false) {
		checkboxParent.classList.add('active')
		checkbox.checked = true
	} else {
		checkboxParent.classList.remove('active')
		checkbox.checked = false
	}
});





let main = document.querySelector(".cats__cards");
cats.forEach(function (cat) {
	let card = `<div class="${cat.favourite ? "cats__card like" : "cats__card"}" style="background-image: url(${cat.img_link})">
<span>${cat.name}</span>
</div>`
	main.innerHTML += card;
});


const api = new Api("Ruslan_Nuriev"); // мое уникальное имя!! Использовать свое!
let form = document.forms[0];
const imgLin = document.querySelector(".popup__image")
form.img_link.addEventListener("change", (e) => {
	imgLin.style.backgroundImage = `url(${e.target.value})`
})
form.img_link.addEventListener("input", (e) => {

	imgLin.style.backgroundImage = `url(${e.target.value})`
})
form.addEventListener("submit", (e) => {
	e.preventDefault();
	let body = {};
	for (let i = 0; i < form.elements.length; i++) {
		let inp = form.elements[i];
		if (inp.type === "checkbox") {
			body[inp.name] = inp.checked;
		} else if (inp.name && inp.value) {
			if (inp.type === "number") {
				body[inp.name] = +inp.value;
			} else {
				body[inp.name] = inp.value;
			}
		}
	}
	console.log(body);
	api.addCat(body)
		.then(res => res.json())
		.then(data => {
			if (data.message === "ok") {
				form.reset();
				closePopupForm.click();
				api.getCat(body.id)
					.then(res => res.json())
					.then(cat => {
						if (cat.message === "ok") {
							catsData.push(cat.data);
							localStorage.setItem("cats", JSON.stringify(catsData));
							getCats(api, catsData);
						} else {
							console.log(cat);
						}
					})
			} else {
				console.log(data);
				api.getIds().then(r => r.json()).then(d => console.log(d));
			}
		})
})

const updCards = function (data) {
	main.innerHTML = ""
	data.forEach(function (cat) {
		if (cat.id) {
			let card = `<div class="${cat.favourite ? "cats__card like" : "cats__card"}" style="background-image:
	url(${cat.img_link || "images/cat.jpg"})">
	<span>${cat.name}</span>
	</div>`;
			main.innerHTML += card;
		}
	});
	let cards = document.getElementsByClassName("cats__card");
	for (let i = 0, cnt = cards.length; i < cnt; i++) {
		const width = cards[i].offsetWidth;
		cards[i].style.height = width * 0.6 + "px";
	}
}


const getCats = function (api) {
	api.getCats()
		.then(res => res.json())
		.then(data => {
			if (data.message === "ok") {
				updCards(data.data);
			}
		})
}
getCats(api);


let catsData = localStorage.getItem("cats");
catsData = catsData ? JSON.parse(catsData) : [];
const getsCats = function (api, store) {
	if (!store.length) {
		api.getCats()
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (data.message === "ok") {
					localStorage.setItem("cats", JSON.stringify(data.data));
					catsData = [...data.data];
					updCards(data.data);
				}
			})
	} else {
		updCards(store);
	}
}
getsCats(api, catsData);