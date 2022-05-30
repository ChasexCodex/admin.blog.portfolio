export const localStoreSupported = () => {
	return 'localStorage' in window && window['localStorage'] !== null
}

const throwIfLocalStoreUnsupported = () => {
	if (!localStoreSupported()) {
		throw new Error('localStore is not supported in this browser')
	}
}

export class Store {
	static globalPrefix = process.env.NEXT_PUBLIC_APP_NAME ?? ''

	constructor(private readonly prefix: string) {}

	saveToStore = <T extends {[p: string]: any}>(key: string, data: T) => {
		throwIfLocalStoreUnsupported()

		const stringData = JSON.stringify(data)
		localStorage.setItem(this.getAccessor(key), stringData)
	}

	loadFromStore = (key: string, error = false) => {
		throwIfLocalStoreUnsupported()

		const data = localStorage.getItem(this.getAccessor(key))

		if (!data) {
			if (error) console.error(`Cannot find object with key ${key} in the localStorage`)
			return false
		}

		return JSON.parse(data)
	}

	clearStore = (key: string) => {
		throwIfLocalStoreUnsupported()

		localStorage.removeItem(this.getAccessor(key))
	}

	private getAccessor = (key: string) => `${Store.globalPrefix}.${this.prefix}:${key}`
}
