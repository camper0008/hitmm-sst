type Stowage = {
    taken: boolean;
    saved_at: string;
};

function lastFlip(): Stowage | null {
    const value = localStorage.getItem("last_flip");
    if (!value) {
        return null;
    }
    return JSON.parse(value);
}

function saveFlip(taken: boolean) {
    const value = localStorage.getItem("last_flip");
    if (!value) {
        return null;
    }
    return JSON.parse(value);
}

function main() {
    const checkbox = document.querySelector<HTMLInputElement>("#checkbox");
    if (!checkbox) {
        throw new Error("unreachable: defined in index.html");
    }

    checkbox.addEventListener("input", () => {
        console.log("yep!", checkbox.checked);
    });

    const last = lastFlip();
    if (!last) {
    }
}

main();
