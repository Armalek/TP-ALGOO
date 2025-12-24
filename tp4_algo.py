import networkx as nx

def bellman_ford_algo(nodes, edges, source):
    G = nx.DiGraph()
    G.add_nodes_from(nodes)

    for u, v, w in edges:
        G.add_edge(u, v, weight=w)

    try:
        dist, pred = nx.single_source_bellman_ford(G, source)
        return {
            "success": True,
            "distances": dist,
            "predecessors": pred
        }
    except nx.NetworkXUnbounded:
        return {
            "success": False,
            "error": "Cycle négatif détecté"
        }


def rlf_coloring(nodes, edges):
    G = nx.Graph()
    G.add_nodes_from(nodes)

    # edges = [u, v] (sans poids)
    for u, v in edges:
        G.add_edge(u, v)

    coloring = {}
    color = 1
    uncolored = set(G.nodes())

    while uncolored:
        v = max(uncolored, key=lambda x: G.degree(x))
        coloring[v] = color
        uncolored.remove(v)

        forbidden = set(G.neighbors(v))
        candidates = uncolored - forbidden

        while candidates:
            u = max(candidates, key=lambda x: len(set(G.neighbors(x)) & uncolored))
            coloring[u] = color
            uncolored.remove(u)
            forbidden |= set(G.neighbors(u))
            candidates = uncolored - forbidden

        color += 1

    return {
        "success": True,
        "coloring": coloring,
        "chromatic_number": max(coloring.values()) if coloring else 0
    }



def build_weighted_graph(nodes, edges):
    G = nx.DiGraph()
    G.add_nodes_from(nodes)
    for u, v, w in edges:
        G.add_edge(u, v, weight=w)
    return G