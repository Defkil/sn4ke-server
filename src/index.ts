#!/usr/bin/env node
import 'reflect-metadata'
import TYPES from './inversify.types'
import { container } from './inversify.container'
import {AppInterface} from "./App";

const main = async (): Promise<void> => {
	const app = container.get<AppInterface>(TYPES.APP)
	await app.setup()
	app.start().catch((err: Error) => {})
}

main().catch((err) => {
	console.error(err)
})

