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

    if (
        now.getFullYear() !== before.getFullYear() ||
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

function renderDefault(
    { takenAt, taken, lever }: RenderOptions,
) {
    takenAt.textContent = "not yet";
    taken.checked = false;
    lever.classList.add("lever-off");
}

type RenderOptions = {
    takenAt: HTMLParagraphElement;
    taken: HTMLInputElement;
    lever: HTMLElement;
};

function render(
    lastFlip: LastFlip,
    { takenAt, taken, lever }: RenderOptions,
) {
    takenAt.textContent = format(lastFlip);
    taken.checked = lastFlip.taken;
    lever.classList.remove("lever-on", "lever-off");
    lever.classList.add(lastFlip.taken ? "lever-on" : "lever-off");
}

function format({ taken, at }: LastFlip) {
    function pad(num: number) {
        const val = num.toString();
        return val.length < 2 ? `0${val}` : val;
    }
    const date = new Date(at);

    return `(${taken ? "yes," : "not today. last taken"} at ${
        pad(date.getDate())
    }/${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${
        pad(date.getMinutes())
    })`;
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
        renderDefault({ takenAt, taken, lever });
        return;
    }
    render(last, { takenAt, taken, lever });
}

main();
