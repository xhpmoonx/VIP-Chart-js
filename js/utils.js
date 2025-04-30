export async function loadCurriculum(path) {
    const res = await fetch(path);
    return res.json();
  }
  