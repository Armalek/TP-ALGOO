function parseNodes() {
  return document.getElementById("nodes").value.split(",").map(v => v.trim());
}

function parseEdges() {
  return document.getElementById("edges").value
    .split("\n")
    .map(l => {
      const [u, v, w] = l.split(" ");
      return [u, v, parseFloat(w)];
    });
}

function runBellman() {
  fetch("/tp4/bellman", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      nodes: parseNodes(),
      edges: parseEdges(),
      source: document.getElementById("source").value
    })
  })
  .then(r => r.json())
  .then(d => {
    document.getElementById("bellman-output").textContent =
      JSON.stringify(d.result, null, 2);

    const img = document.getElementById("bellman-img");
    img.src = "data:image/png;base64," + d.image;
    img.style.display = "block";
  });
}

function runRLF() {
  fetch("/tp4/rlf", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      nodes: parseNodes(),
      edges: parseEdges() // parseEdges() renvoie [u,v,w], backend nettoie
    })
  })
  .then(r => r.json())
  .then(d => {
    document.getElementById("rlf-output").textContent =
      JSON.stringify(d.coloring, null, 2);

    const img = document.getElementById("rlf-img");
    // Dessin coloré
    if(d.success && d.coloring) {
      const nodes = Object.keys(d.coloring);
      const edges = parseEdges().map(e => [e[0], e[1]]);
      fetch("/tp4/rlf-draw", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nodes, edges, coloring: d.coloring})
      })
      .then(r => r.json())
      .then(imgData => {
        img.src = "data:image/png;base64," + imgData.image;
        img.style.display = "block";
      });
    }
  });
}



