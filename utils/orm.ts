import {TimeStamp} from '@/types'
import moment from 'moment'

export const FormatNew = <T>({id, name}: {id: number | string, name: string}) => {
	return id === name ? {name} : {id}
}

export const convertTimestampToMoment = <T extends TimeStamp>(model: T, format = 'MMMM Do YYYY, h:mm:ss a') => {
	return {
		...model,
		created_at: moment(model.created_at).format(format),
		updated_at: moment(model.updated_at).format(format),
	}
}