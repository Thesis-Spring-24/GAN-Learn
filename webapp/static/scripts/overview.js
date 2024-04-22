document.getElementById("gen-btn").addEventListener("click", navigateToGenerator);

function navigateToGenerator() {
    window.location.href = "/generator";

}

document.getElementById("dis-btn").addEventListener("click", navigateToDiscriminator);

function navigateToDiscriminator() {
    window.location.href = "/discriminator";

}