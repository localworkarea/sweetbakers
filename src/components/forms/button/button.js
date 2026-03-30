import './button.scss'

const btnMain = document.querySelectorAll('[data-fls-button]')

if (btnMain.length > 0) {

	const media = window.matchMedia('(min-width: 820px)')

	btnMain.forEach(btn => {

		const handler = (e) => setPosition(e, btn)

		function add() {
			btn.addEventListener('mouseenter', handler)
			btn.addEventListener('mousemove', handler)
		}

		function remove() {
			btn.removeEventListener('mouseenter', handler)
			btn.removeEventListener('mousemove', handler)
		}

		function check(e) {
			if (e.matches) {
				add()
			} else {
				remove()
			}
		}

		// init
		check(media)

		// слушаем изменения
		media.addEventListener('change', check)
	})

	function setPosition(e, el) {
		const rect = el.getBoundingClientRect()

		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		el.style.setProperty('--x', `${x}px`)
		el.style.setProperty('--y', `${y}px`)
	}
}