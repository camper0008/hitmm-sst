type LastFlip = {
    taken: boolean;
    at: string;
};

function lastFlip(): LastFlip | null {
    const value = localStorage.getItem("last_flip");
    if (!value) {
        return null;
    }
    const lastFlip: LastFlip = JSON.parse(value);
    const before = new Date(lastFlip.at);
    const now = new Date();

    console.log(now.getDate() !== before.getDate());
    if (
        now.getMonth() !== before.getMonth() ||
        now.getDate() !== before.getDate()
    ) {
        lastFlip.taken = false;
    }
    return lastFlip;
}

function saveFlip(lastFlip: LastFlip) {
    localStorage.setItem("last_flip", JSON.stringify(lastFlip));
}

type RenderOptions = {
    takenAt: HTMLParagraphElement;
    taken: HTMLInputElement;
    lever: HTMLElement;
};

function render(
    storage: LastFlip,
    { takenAt, taken, lever }: RenderOptions,
) {
    takenAt.textContent = format(storage.at);
    taken.checked = storage.taken;
    lever.classList.remove("lever-on", "lever-off");
    lever.classList.add(storage.taken ? "lever-on" : "lever-off");
}

function format(input: string) {
    function pad(num: number) {
        const val = num.toString();
        return val.length < 2 ? `0${val}` : val;
    }
    const date = new Date(input);

    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${
        pad(date.getHours())
    }:${pad(date.getMinutes())}`;
}

function main() {
    const taken = document.querySelector<HTMLInputElement>("#taken");
    const takenAt = document.querySelector<HTMLParagraphElement>("#taken-at");
    const lever = document.querySelector<HTMLElement>("#lever");
    if (!taken || !takenAt || !lever) {
        throw new Error("unreachable: defined in index.html");
    }

    taken.addEventListener("input", () => {
        const at = new Date().toISOString();
        const lastFlip: LastFlip = {
            at,
            taken: taken.checked,
        };
        saveFlip(lastFlip);
        render(lastFlip, { takenAt, taken, lever });
    });

    const last = lastFlip();
    if (!last) {
        return;
    }
    render(last, { takenAt, taken, lever });
}

main();
