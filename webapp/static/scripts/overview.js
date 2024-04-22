document.getElementById("gen-btn").addEventListener("click", navigateToGenerator);
document.getElementById("dis-btn").addEventListener("click", navigateToDiscriminator);
document.getElementById("flower-btn").addEventListener("click", navigateToFlowers);


function navigateToGenerator() {
    window.location.href = "/generator";
}

function navigateToDiscriminator() {
    window.location.href = "/discriminator";
}

function navigateToFlowers() {
    window.location.href = "/flowers";
}