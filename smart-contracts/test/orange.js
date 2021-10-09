const Orange = artifacts.require("Orange");
// var getRandomValues = require('get-random-values');
nodeCrypto = require("crypto");

function customGetRandomValues(buf) {
  // if (window.crypto && window.crypto.getRandomValues) {
  //   return window.crypto.getRandomValues(buf);
  // }
  // if (typeof window.msCrypto === 'object' && typeof window.msCrypto.getRandomValues === 'function') {
  //   return window.msCrypto.getRandomValues(buf);
  // }
  if (nodeCrypto.randomBytes) {
    if (!(buf instanceof Uint8Array)) {
      throw new TypeError("expected Uint8Array");
    }
    if (buf.length > 65536) {
      var e = new Error();
      e.code = 22;
      e.message =
        "Failed to execute 'getRandomValues' on 'Crypto': The " +
        "ArrayBufferView's byte length (" +
        buf.length +
        ") exceeds the " +
        "number of bytes of entropy available via this API (65536).";
      e.name = "QuotaExceededError";
      throw e;
    }
    var bytes = nodeCrypto.randomBytes(buf.length);
    buf.set(bytes);
    return buf;
  } else {
    throw new Error("No secure random number generator available.");
  }
}

function rnd256() {
  const bytes = new Uint8Array(32);

  // load cryptographically random bytes into array
  customGetRandomValues(bytes);

  // convert byte array to hexademical representation
  const bytesHex = bytes.reduce(
    (o, v) => o + ("00" + v.toString(16)).slice(-2),
    ""
  );

  // convert hexademical value to a decimal string
  return BigInt("0x" + bytesHex).toString(10);
}

contract("Test orange", async (accounts) => {
  const id = rnd256();

  it("should add and get job", async () => {
    const orange = await Orange.deployed();

    const res = await orange.addJob(
      id,
      "this-is-a-test-cid",
      "python",
      "Some Computation",
      2,
      4096 * 1024
    );
    // console.log(res);
    const res1 = await orange.getJob(id);

    assert.equal(res1.isValid, true);
    assert.equal(res1.cid, "this-is-a-test-cid");
    assert.equal(res1.type_, "python");
    assert.equal(res1.name, "Some Computation");
    assert.equal(res1.available, true);
    assert.equal(res1.acceptedBy, 0);
    assert.equal(res1.outputCid, "");
    assert.equal(res1.numCpus, 2);
    assert.equal(res1.memBytes, 4096 * 1024);
  });

  it("should accept job", async () => {
    const orange = await Orange.deployed();
    const accounts = await web3.eth.getAccounts();

    const res = await orange.acceptJob(
      id,
      accounts[1]
    );
    // console.log(res);
    const res1 = await orange.getJob(id);

    assert.equal(res1.isValid, true);
    assert.equal(res1.cid, "this-is-a-test-cid");
    assert.equal(res1.type_, "python");
    assert.equal(res1.name, "Some Computation");
    assert.equal(res1.available, false);
    assert.equal(res1.acceptedBy, accounts[1]);
    assert.equal(res1.outputCid, "");
    assert.equal(res1.numCpus, 2);
    assert.equal(res1.memBytes, 4096 * 1024);
  });

  it("should put job output", async () => {
    const orange = await Orange.deployed();
    const accounts = await web3.eth.getAccounts();

    const res = await orange.putJobOutput(
      id,
      "this-is-another-test-cid"
    );
    // console.log(res);
    const res1 = await orange.getJob(id);

    assert.equal(res1.isValid, true);
    assert.equal(res1.cid, "this-is-a-test-cid");
    assert.equal(res1.type_, "python");
    assert.equal(res1.name, "Some Computation");
    assert.equal(res1.available, false);
    assert.equal(res1.acceptedBy, accounts[1]);
    assert.equal(res1.outputCid, "this-is-another-test-cid");
    assert.equal(res1.numCpus, 2);
    assert.equal(res1.memBytes, 4096 * 1024);
  });
});
