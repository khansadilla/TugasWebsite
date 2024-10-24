// Mendapatkan elemen DOM
const acidVolumeInput = document.getElementById("acid-volume");
const baseVolumeInput = document.getElementById("base-volume");
const acidValueDisplay = document.getElementById("acid-value");
const baseValueDisplay = document.getElementById("base-value");
const outputDiv = document.getElementById("output");
const colorIndicator = document.getElementById("color-indicator");

// Mendapatkan container untuk visualisasi molekul 3D
const moleculeContainer = document.getElementById('molecule-visualization');

// Membuat scene, camera, dan renderer untuk Three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);  // Warna biru cerah (SkyBlue)

const camera = new THREE.PerspectiveCamera(75, moleculeContainer.offsetWidth / moleculeContainer.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Mengatur ukuran renderer dan menambahkan ke container
renderer.setSize(moleculeContainer.offsetWidth, moleculeContainer.offsetHeight);
moleculeContainer.appendChild(renderer.domElement);

// Cahaya untuk molekul
const light = new THREE.PointLight(0xffffff);
light.position.set(10, 10, 10);
scene.add(light);

// Material dan geometri untuk molekul
const acidMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });  // Molekul H+ (merah)
const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });  // Molekul OH- (biru)
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);  // Bola representasi molekul

// Kamera posisi
camera.position.z = 5;

// Fungsi untuk memperbarui tampilan volume dan visualisasi molekul
function updateVolumeDisplays() {
    const acidVolume = parseInt(acidVolumeInput.value);
    const baseVolume = parseInt(baseVolumeInput.value);

    // Memperbarui tampilan volume
    acidValueDisplay.textContent = acidVolume;
    baseValueDisplay.textContent = baseVolume;

    // Hitung pH dan visualisasi
    visualize(acidVolume, baseVolume);
    updateMoleculeVisualization(acidVolume, baseVolume);
}

// Fungsi untuk visualisasi pH dan hasil simulasi
function visualize(acidVolume, baseVolume) {
    const totalVolume = acidVolume + baseVolume;
    let pH;
    const acidStrength = 1; // Konsentrasi HCl
    const baseStrength = 1; // Konsentrasi NaOH

    if (totalVolume === 0) {
        pH = null;
        outputDiv.textContent = "Silakan tambahkan larutan asam atau basa.";
        colorIndicator.style.backgroundColor = ""; // Clear color
    } else {
        const molesOfHplus = acidVolume * acidStrength;
        const molesOfOHminus = baseVolume * baseStrength;

        if (molesOfHplus > molesOfOHminus) {
            pH = -Math.log10((molesOfHplus - molesOfOHminus) / totalVolume);
            // Warna untuk asam (pH rendah), mulai dari merah (Hue = 0) hingga oranye (Hue = 30)
            const hue = Math.max(0, Math.min(30, pH * 5)); // Rentang warna asam 0-30
            colorIndicator.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
            outputDiv.textContent = `Larutan bersifat asam dengan pH: ${pH.toFixed(2)}`;
        } else if (molesOfHplus < molesOfOHminus) {
            pH = 14 + Math.log10((molesOfOHminus - molesOfHplus) / totalVolume);
            // Warna untuk basa (pH tinggi), mulai dari biru (Hue = 240) hingga hijau muda (Hue = 120)
            const hue = Math.max(120, Math.min(240, 240 - (pH * 10))); // Rentang warna basa 120-240
            colorIndicator.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
            outputDiv.textContent = `Larutan bersifat basa dengan pH: ${pH.toFixed(2)}`;
        } else {
            pH = 7;
            colorIndicator.style.backgroundColor = `hsl(60, 100%, 50%)`; // Warna kuning untuk netral
            outputDiv.textContent = "Larutan bersifat netral dengan pH: 7.00";
        }
    }
}



// Fungsi untuk memperbarui visualisasi molekul
function updateMoleculeVisualization(acidVolume, baseVolume) {
    // Hapus semua molekul yang ada sebelumnya
    while (scene.children.length > 1) {
        scene.remove(scene.children[1]);
    }

    // Tambahkan molekul asam H+ sesuai volume
    for (let i = 0; i < acidVolume / 10; i++) {
        const molecule = new THREE.Mesh(sphereGeometry, acidMaterial);
        molecule.position.set(Math.random() * 4 - 2, Math.random() * 2 - 1, Math.random() * 2 - 1);
        scene.add(molecule);
    }

    // Tambahkan molekul basa OH- sesuai volume
    for (let i = 0; i < baseVolume / 10; i++) {
        const molecule = new THREE.Mesh(sphereGeometry, baseMaterial);
        molecule.position.set(Math.random() * 4 - 2, Math.random() * 2 - 1, Math.random() * 2 - 1);
        scene.add(molecule);
    }

    // Render scene dengan molekul yang diperbarui
    renderer.render(scene, camera);
}

// Fungsi animasi untuk rendering Three.js
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Event listener untuk input volume
acidVolumeInput.addEventListener("input", updateVolumeDisplays);
baseVolumeInput.addEventListener("input", updateVolumeDisplays);

// Inisialisasi tampilan awal
document.addEventListener("DOMContentLoaded", () => {
    updateVolumeDisplays();
});
