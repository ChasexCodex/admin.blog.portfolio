import Joi from 'joi'

const FindSchema = Joi.object<{id: number}>({
	id: Joi.number().required(),
})

export default FindSchema