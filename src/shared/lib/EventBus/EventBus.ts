import { EventPayloads } from "@/shared/lib/EventBus/Events";

type EventCallback<T> = (payload: T) => void;

class EventBus {
	constructor() {}
	private events: { [key: string]: EventCallback<any>[] } = {};

	public on<K extends keyof EventPayloads>(event: K, callback: EventCallback<EventPayloads[K]>): void {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(callback);
	}

	public off<K extends keyof EventPayloads>(event: K, callbackToRemove: EventCallback<EventPayloads[K]>): void {
		if (!this.events[event]) return;

		this.events[event] = this.events[event].filter(listener => listener !== callbackToRemove);
	}

	public emit<K extends keyof EventPayloads>(event: K, payload?: EventPayloads[K]): void {
		if (!this.events[event]) return;

		this.events[event].forEach(callback => callback(payload));
	}
}

export const eventBus = new EventBus();
