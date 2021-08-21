const chunk = (arr, size, out) => {
  out = out || [];
  if (!arr.length) return out;
  out.push(arr.slice(0, size));
  return chunk(arr.slice(size), size, out);
};

module.exports = chunk;
