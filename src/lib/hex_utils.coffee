
module.exports = class HexUtils

  @NEIGHBOURS: [
    [+1,  0], [+1, -1], [ 0, -1],
    [-1,  0], [-1, +1], [ 0, +1]
  ]

  @heightFromSize: (size) => size*2
  @widthFromSize: (size) => Math.sqrt(3)/2 * @heightFromSize(size)

  @neighbour: (q, r, direction) =>
    (direction = r; {q, r} = q) if arguments.length is 2
    d = @NEIGHBOURS[direction]
    return {q: q + d[0], r: r + d[1]}

  @axialToCubeCoords: (q, r) => {x: q, z: r, y: -q - r}

  @cubeToAxialCoords: (x, y, z) => {q: x, r: z}

  @pixelToCoords: (x, y, tile_size) =>
    q = (1/3*Math.sqrt(3) * x - 1/3 * y) / tile_size
    r = 2/3 * y / tile_size
    return @roundCoords(q, r)

  @roundCoords: (q, r) =>
    {q, r} = q if arguments.length is 1
    {x, y, z} = @roundCoordsCubic(HexUtils.axialToCubeCoords(q, r))
    return @cubeToAxialCoords(x, y, z)

  @roundCoordsCubic: (x, y, z) =>
    {x, y, z} = x if arguments.length is 1

    rx = Math.round(x)
    ry = Math.round(y)
    rz = Math.round(z)

    x_diff = Math.abs(rx - x)
    y_diff = Math.abs(ry - y)
    z_diff = Math.abs(rz - z)

    if x_diff > y_diff and x_diff > z_diff
      rx = -ry-rz
    else if y_diff > z_diff
      ry = -rx-rz
    else
      rz = -rx-ry

    return {x: rx, y: ry, z: rz}

  @distance: (r1, q1, r2, q2) =>
    if arguments.length is 2
      [q2, r2] = [q1.q, q1.r]
      [q1, r1] = [r1.q, r1.r]
    return @distanceCubic(@axialToCubeCoords(q1, r1), @axialToCubeCoords(q2, r2))

  @distanceCubic: (x1, y1, z1, x2, y2, z2) =>
    if arguments.length is 2
      [x2, y2, z2] = [y1.x, y1.y, y1.z]
      [x1, y1, z1] = [x1.x, x1.y, x1.z]
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2), Math.abs(z1 - z2))

  @line: (r1, q1, r2, q2) =>
    if arguments.length is 2
      [q2, r2] = [q1.q, q1.r]
      [q1, r1] = [r1.q, r1.r]
    points = []
    n = @distance(r1, q1, r2, q2)
    for i in [0..n]
      db = i/n
      da = 1 - db
      points.push(@roundCoords(q1*da + q2*db, r1*da + r2*db))

    return points
