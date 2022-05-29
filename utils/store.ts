import moment from 'moment'

export const localStoreSupported = () => {
	return 'localStorage' in window && window['localStorage'] !== null
}

const throwIfLocalStoreUnsupported = () => {
	if (!localStoreSupported()) {
		throw new Error('localStore is not supported in this browser')
	}
}

const updateKeys = (key: string) => {
	const storageKeys = localStorage.getItem('keys')

	const currentKeys = storageKeys ? JSON.parse(storageKeys) as string[] : []

	if (!currentKeys.includes(key)) {
		currentKeys.push(key)
	}

	localStorage.setItem('keys', JSON.stringify(currentKeys))
}

const removeKey = (key: string) => {
	const storageKeys = localStorage.getItem('keys')

	if (!storageKeys) {
		return
	}

	const currentKeys = JSON.parse(storageKeys) as string[]

	const newKeys = currentKeys.filter(k => k !== key)

	localStorage.setItem('keys', JSON.stringify(newKeys))
}

export const saveToStore = <T extends {[p: string]: any}>(key: string, data: T) => {
	throwIfLocalStoreUnsupported()

	const stringData = JSON.stringify({...data, lastEdit: moment.now()})
	localStorage.setItem(key, stringData)

	updateKeys(key)
}

export const loadFromStore = (key: string) => {
	throwIfLocalStoreUnsupported()

	const data = localStorage.getItem(key)

	if (!data) {
		console.error(`Cannot find object with key ${key} in the localStorage`)
		return false
	}

	return JSON.parse(data)
}

export const changeKey = (oldKey: string, newKey: string) => {
	const data = loadFromStore(oldKey)
	clearStore(oldKey)
	saveToStore(newKey, data)
}

export const clearStore = (key: string) => {
	throwIfLocalStoreUnsupported()

	localStorage.removeItem(key)

	removeKey(key)
}
