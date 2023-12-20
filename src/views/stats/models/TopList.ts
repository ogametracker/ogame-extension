export class TopList<T> {
    readonly #comparator: (a: T, b: T) => number;
    readonly #maxSize: number;
    readonly #elements: T[];

    public constructor(options: {
        comparator: (a: T, b: T) => number;
        maxSize: number;
    }) {
        this.#comparator = options.comparator;
        this.#maxSize = options.maxSize;

        this.#elements = [];
    }

    public get values(): T[] {
        return [...this.#elements];
    }

    public add(element: T) {
        if (this.#elements.length == 0) {
            this.#elements.push(element);
            return;
        }

        const first = this.#elements[0];
        if (this.#comparator(element, first) < 0) {
            this.#elements.unshift(element);
            this.#trimSize();
            return;
        }

        const index = this.#elements.findIndex(e => this.#comparator(element, e) < 0);
        // `element` is the worst
        if (index == -1) {
            this.#elements.push(element);
        } else {
            this.#elements.splice(index, 0, element);
        }
        this.#trimSize();
    }

    #trimSize() {
        this.#elements.splice(this.#maxSize);
    }
}