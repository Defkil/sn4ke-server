import {RoomCode} from "../../model/room/room.model.interface";
import {PLAYER_COUNT_TO_MAP} from "../game-map/game-map.controller";
import {Direction, SnakeData} from "./player.controller.interface";

const snakeLength = 3
const distanceToBorder = 5
const distanceToOtherSnakes = 5


export function getSnakePositions(rooms: {
	room: RoomCode, playerCount: number
}[]): {
	[key: RoomCode]: SnakeData[]
} {
	const playerCountCache: Map<number, SnakeData> = new Map()
	const res: {
		[key: RoomCode]: SnakeData[]
	} = {}

	const generateHeads = (playerCount: number, width: number, height: number): { x: number, y: number }[] => {
		const heads: { x: number, y: number }[] = []
		const generateHead = () => {
			return {
				x: Math.floor(Math.random() * (width - distanceToBorder * 2) + distanceToBorder),
				y: Math.floor(Math.random() * (height - distanceToBorder * 2) + distanceToBorder)
			}
		}
		for (let i = 0; i < playerCount; i++) {
			let head = generateHead()
			let maxTries = 20
			while (heads.some(h => Math.abs(h.x - head.x) < distanceToOtherSnakes && Math.abs(h.y - head.y) < distanceToOtherSnakes) && maxTries > 0) {
				head = generateHead()
				maxTries--
			}
			heads.push(head)
		}
		return heads
	}

	const directionAwayFromWall = (head: { x: number, y: number }, width: number, height: number): Direction => {
		const distanceToTopWall = head.y
		const distanceToBottomWall = height - head.y
		const distanceToLeftWall = head.x
		const distanceToRightWall = width - head.x
		const minDistance = Math.min(distanceToTopWall, distanceToBottomWall, distanceToLeftWall, distanceToRightWall)
		if (minDistance === distanceToTopWall) {
			return Direction.DOWN
		} else if (minDistance === distanceToBottomWall) {
			return Direction.UP
		} else if (minDistance === distanceToLeftWall) {
			return Direction.RIGHT
		} else {
			return Direction.LEFT
		}
	}

	const generateSnake = (head: { x: number, y: number }, direction: Direction): { x: number, y: number }[] => {
		const snake: { x: number, y: number }[] = []
		const toLeft = (i: number) => {
			return {
				x: head.x - i, y: head.y
			}
		}
		const toRight = (i: number) => {
			return {
				x: head.x + i, y: head.y
			}
		}
		const toUp = (i: number) => {
			return {
				x: head.x, y: head.y - i
			}
		}
		const toDown = (i: number) => {
			return {
				x: head.x, y: head.y + i
			}
		}
		for (let i = 0; i < snakeLength; i++) {
			switch (direction) {
				case Direction.LEFT:
					snake.push(toLeft(i))
					break
				case Direction.RIGHT:
					snake.push(toRight(i))
					break
				case Direction.UP:
					snake.push(toUp(i))
					break
				case Direction.DOWN:
					snake.push(toDown(i))
					break
			}
		}
		return snake
	}

	for (let i = 0, length = rooms.length; i < length; i++) {
		const room = rooms[i]
		if (playerCountCache.has(room.playerCount)) {
			res[room.room] = [playerCountCache.get(room.playerCount)!]
			continue
		}

		const {width, height} = PLAYER_COUNT_TO_MAP.get(room.playerCount)!
		const heads = generateHeads(room.playerCount, width, height)
		const directions = heads.map(head => directionAwayFromWall(head, width, height))
		const snakes = heads.map((head, i) => generateSnake(head, directions[i]))
		const snakeData = snakes.map((snake, i) => {
			const direction = directions[i] as Direction
			const head = snake[0]
			return {
				head, direction, snake
			}
		})
		res[room.room] = snakeData
	}

	return res
}
