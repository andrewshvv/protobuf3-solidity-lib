
const protobuf = require("protobufjs/light");


const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("protobufjs", async () => {
  let instance;

  beforeEach(async () => {
    const factory = await ethers.getContractFactory("TestFixture");
    instance = await factory.deploy();
    await instance.deployed();
  });

  it("protobufjs encoding", async () => {
    const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
    const message = Message.create({ field: 300 });
    const encoded = Message.encode(message).finish().toString("hex");

    // field 1 -> 08
    // 300 -> ac 02
    expect(encoded).to.be.equal("08ac02");
  });

  it("protobufjs not bijective", async () => {
    // Show protobufjs is not bijective
    const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
    const decoded = Message.decode(Buffer.from("08FFFFFFFFFFFFFFFFFF7F", "hex"));
    const field = decoded.toJSON().field;

    expect(field).to.be.equal("18446744073709551615");
  });

  it("protobufjs accepts extra bytes", async () => {
    // Show protobufjs accepts up to 8 bytes for 4-byte ints
    const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint32"));
    const decoded = Message.decode(Buffer.from("08FFFFFFFFFFFFFFFFFF01", "hex"));
    const field = decoded.toJSON().field;

    expect(field).to.be.equal(4294967295);
  });
});


describe("constructor", async () => {
  it("should deploy", async () => {
    const factory = await ethers.getContractFactory("TestFixture");
    const instance = await factory.deploy();
    await instance.deployed();
  });


  //////////////////////////////////////
  // NOTICE
  // Tests call functions twice, once to run and another to measure gas.
  //////////////////////////////////////

  describe("decode", async () => {
    describe("passing", async () => {
      let instance;

      beforeEach(async () => {
        const factory = await ethers.getContractFactory("TestFixture");
        instance = await factory.deploy();
        await instance.deployed();
      });

      it("varint", async () => {
        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
        const message = Message.create({ field: 300 });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_varint(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(3);
        expect(val).to.be.equal(300);

        await instance.decode_varint(1, "0x" + encoded);
      });

      it("key", async () => {
        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 2, "uint64"));
        const message = Message.create({ field: 3 });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_key(0, "0x" + encoded);
        const { 0: success, 1: pos, 2: field, 3: type } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(1);
        expect(field).to.be.equal(2);
        expect(type).to.be.equal(0);

        await instance.decode_key(0, "0x" + encoded);
      });

      it("int32 positive", async () => {
        const v = 300;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_int32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_int32(1, "0x" + encoded);
      });

      it("int32 negative", async () => {
        const v = -300;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_int32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_int32(1, "0x" + encoded);
      });

      it("int32 max", async () => {
        const v = 2147483647;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_int32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_int32(1, "0x" + encoded);
      });

      it("int32 min", async () => {
        const v = -2147483648;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_int32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_int32(1, "0x" + encoded);
      });

      it("uint32", async () => {
        const v = 300;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_uint32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_uint32(1, "0x" + encoded);
      });

      it("uint32 max", async () => {
        const v = 4294967295;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_uint32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_uint32(1, "0x" + encoded);
      });

      it("uint64", async () => {
        const v = "4294967296";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_uint64(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_uint64(1, "0x" + encoded);
      });

      it("uint64 max", async () => {
        const v = "18446744073709551615";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_uint64(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos.toNumber()).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_uint64(1, "0x" + encoded);
      });

      it("int64 max", async () => {
        const v = "9223372036854775807";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_int64(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_int64(1, "0x" + encoded);
      });

      it("int64 min", async () => {
        const v = "-9223372036854775808";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_int64(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_int64(1, "0x" + encoded);
      });

      it("sint32 max", async () => {
        const v = 2147483647;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sint32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");


        const result = await instance.callStatic.decode_sint32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_sint32(1, "0x" + encoded);
      });

      it("sint32 min", async () => {
        const v = -2147483648;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sint32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_sint32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_sint32(1, "0x" + encoded);
      });

      it("sint64 max", async () => {
        const v = "9223372036854775807";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sint64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_sint64(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_sint64(1, "0x" + encoded);
      });

      it("sint64 min", async () => {
        const v = "-9223372036854775808";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sint64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_sint64(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_sint64(1, "0x" + encoded);
      });

      it("bool true", async () => {
        const v = true;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "bool"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_bool(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_bool(1, "0x" + encoded);
      });

      it("bool false", async () => {
        const v = false;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "bool"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_bool(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_bool(1, "0x" + encoded);
      });

      it("enum", async () => {
        const EnumStruct = {
          ONE: 1,
          TWO: 2,
          THREE: 3,
        };

        const v = EnumStruct.THREE;

        const Message = new protobuf.Type("Message")
          .add(new protobuf.Field("field", 1, "bool"))
          .add(new protobuf.Field("field2", 2, "Enum"))
          .add(new protobuf.Enum("Enum", EnumStruct));
        const message = Message.create({ field: 1, field2: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_enum(3, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_enum(3, "0x" + encoded);
      });

      it("bits64", async () => {
        const v = "4294967296";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "fixed64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_bits64(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_bits64(1, "0x" + encoded);
      });

      it("fixed64", async () => {
        const v = "4294967296";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "fixed64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_fixed64(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_fixed64(1, "0x" + encoded);
      });

      it("sfixed64 max", async () => {
        const v = "9223372036854775807";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sfixed64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_sfixed64(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_sfixed64(1, "0x" + encoded);
      });

      it("sfixed64 min", async () => {
        const v = "-9223372036854775808";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sfixed64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_sfixed64(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_sfixed64(1, "0x" + encoded);
      });

      it("bits32", async () => {
        const v = 300;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "fixed32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_bits32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_bits32(1, "0x" + encoded);
      });

      it("fixed32", async () => {
        const v = 300;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "fixed32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_fixed32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_fixed32(1, "0x" + encoded);
      });

      it("sfixed32 max", async () => {
        const v = 2147483647;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sfixed32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_sfixed32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_sfixed32(1, "0x" + encoded);
      });

      it("sfixed32 min", async () => {
        const v = -2147483648;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sfixed32"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_sfixed32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_sfixed32(1, "0x" + encoded);
      });

      it("length-delimited", async () => {
        const v = Buffer.from("deadbeef", "hex");

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "bytes"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_length_delimited(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(2);
        expect(val).to.be.equal(encoded.length / 2 - 2);

        await instance.decode_length_delimited(1, "0x" + encoded);
      });

      it("string", async () => {
        const v = "foobar";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "string"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_string(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(encoded.length / 2);
        expect(val).to.be.equal(v);

        await instance.decode_string(1, "0x" + encoded);
      });

      it("bytes", async () => {
        const v = Buffer.from("deadbeef", "hex");

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "bytes"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_bytes(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(2);
        expect(val).to.be.equal(encoded.length / 2 - 2);

        await instance.decode_bytes(1, "0x" + encoded);
      });

      it("embedded message", async () => {
        const EmbeddedMessage = new protobuf.Type("EmbeddedMessage").add(new protobuf.Field("field", 1, "uint64"));
        const embeddedMessage = EmbeddedMessage.create({ field: 300 });

        const Message = new protobuf.Type("Message")
          .add(new protobuf.Field("field", 1, "EmbeddedMessage"))
          .add(EmbeddedMessage);
        const message = Message.create({ field: embeddedMessage });

        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_embedded_message(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(2);
        expect(val).to.be.equal(encoded.length / 2 - 2);

        await instance.decode_embedded_message(1, "0x" + encoded);
      });

      it("packed repeated", async () => {
        const v = [300, 42, 69];

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64", "repeated"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_packed_repeated(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(true);
        expect(pos).to.be.equal(2);
        expect(val).to.be.equal(encoded.length / 2 - 2);

        await instance.decode_packed_repeated(1, "0x" + encoded);
      });
    });

    describe("failing", async () => {
      let instance;

      beforeEach(async () => {
        const factory = await ethers.getContractFactory("TestFixture");
        instance = await factory.deploy();
        await instance.deployed();
      });

      it("uint32 too large", async () => {
        const v = "4294967296";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_uint32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("uint64 too large", async () => {
        const result = await instance.callStatic.decode_uint64(0, "0xFFFFFFFFFFFFFFFFFFFF01");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("key varint invalid", async () => {
        const result = await instance.callStatic.decode_key(0, "0xFFFFFFFFFFFFFFFFFFFFF1");
        const { 0: success, 1: pos, 2: field, 3: type } = result;
        expect(success).to.be.equal(false);
      });

      it("key wire type invalid", async () => {
        const result = await instance.callStatic.decode_key(0, "0x0F");
        const { 0: success, 1: pos, 2: field, 3: type } = result;
        expect(success).to.be.equal(false);
      });

      it("key wire type start group", async () => {
        const result = await instance.callStatic.decode_key(0, "0x03");
        const { 0: success, 1: pos, 2: field, 3: type } = result;
        expect(success).to.be.equal(false);
      });

      it("key wire type end group", async () => {
        const result = await instance.callStatic.decode_key(0, "0x04");
        const { 0: success, 1: pos, 2: field, 3: type } = result;
        expect(success).to.be.equal(false);
      });

      it("varint index out of bounds", async () => {
        const result = await instance.callStatic.decode_varint(0, "0x80");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("varint trailing zeroes", async () => {
        const result = await instance.callStatic.decode_varint(0, "0x8000");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("varint more than 64 bits", async () => {
        const result = await instance.callStatic.decode_varint(0, "0xFFFFFFFFFFFFFFFFFF7F");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("int32 varint invalid", async () => {
        const result = await instance.callStatic.decode_int32(0, "0xFFFFFFFFFFFFFFFFFFFFF1");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("int32 high bytes nonzero", async () => {
        const v = "4294967296";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_int32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("int64 varint invalid", async () => {
        const result = await instance.callStatic.decode_int64(0, "0xFFFFFFFFFFFFFFFFFFFFF1");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("uint32 varint invalid", async () => {
        const result = await instance.callStatic.decode_uint32(0, "0xFFFFFFFFFFFFFFFFFFFFF1");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("sint32 varint invalid", async () => {
        const result = await instance.callStatic.decode_sint32(0, "0xFFFFFFFFFFFFFFFFFFFFF1");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("sint32 high bytes nonzero", async () => {
        const v = "4294967296";

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_sint32(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("sint64 varint invalid", async () => {
        const result = await instance.callStatic.decode_sint64(0, "0xFFFFFFFFFFFFFFFFFFFFF1");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("bool varint invalid", async () => {
        const result = await instance.callStatic.decode_bool(0, "0xFFFFFFFFFFFFFFFFFFFFF1");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("bool not 0 or 1", async () => {
        const v = 2;

        const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
        const message = Message.create({ field: v });
        const encoded = Message.encode(message).finish().toString("hex");

        const result = await instance.callStatic.decode_bool(1, "0x" + encoded);
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("bits64 too short", async () => {
        const result = await instance.callStatic.decode_bits64(0, "0x00");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("fixed64 bits64 invalid", async () => {
        const result = await instance.callStatic.decode_fixed64(0, "0x00");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("sfixed64 bits64 invalid", async () => {
        const result = await instance.callStatic.decode_sfixed64(0, "0x00");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("bits32 too short", async () => {
        const result = await instance.callStatic.decode_bits32(0, "0x00");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("fixed32 bits32 invalid", async () => {
        const result = await instance.callStatic.decode_fixed32(0, "0x00");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("sfixed32 bits32 invalid", async () => {
        const result = await instance.callStatic.decode_sfixed32(0, "0x00");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("length-delimited varint invalid", async () => {
        const result = await instance.callStatic.decode_length_delimited(0, "0xFFFFFFFFFFFFFFFFFFFFF1");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("length-delimited out of bounds", async () => {
        const result = await instance.callStatic.decode_length_delimited(0, "0xAC02");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("string length-delimited invalid", async () => {
        const result = await instance.callStatic.decode_string(0, "0xFFFFFFFFFFFFFFFFFFFFF1");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });

      it("length-delimited overflow", async () => {
        const result = await instance.callStatic.decode_length_delimited(0, "0xFFFFFFFFFFFFFFFFFF01");
        const { 0: success, 1: pos, 2: val } = result;
        expect(success).to.be.equal(false);
      });
    });
  });

  describe("encode", async () => {
    let instance;

    beforeEach(async () => {
      const factory = await ethers.getContractFactory("TestFixture");
      instance = await factory.deploy();
      await instance.deployed();
    });

    it("varint", async () => {


      const v = 300;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_varint(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_varint(v);
    });

    it("key", async () => {


      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 2, "uint64"));
      const message = Message.create({ field: 1 });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_key(2, 0);
      expect(result).to.be.equal("0x" + encoded.slice(0, 2));

      await instance.encode_key(2, 0);
    });

    it("int32 positive", async () => {


      const v = 300;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_int32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_int32(v);
    });

    it("int32 negative", async () => {


      const v = -300;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_int32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_int32(v);
    });

    it("int32 max", async () => {


      const v = 2147483647;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_int32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_int32(v);
    });

    it("int32 min", async () => {


      const v = -2147483648;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_int32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_int32(v);
    });

    it("uint32", async () => {


      const v = 300;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_uint32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_uint32(v);
    });

    it("uint32 max", async () => {


      const v = 4294967295;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_uint32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_uint32(v);
    });

    it("uint64", async () => {


      const v = "4294967296";

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_uint64(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_uint64(v);
    });

    it("uint64 max", async () => {


      const v = "18446744073709551615";

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_uint64(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_uint64(v);
    });

    it("int64 max", async () => {


      const v = "9223372036854775807";

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int64"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_int64(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_int64(v);
    });

    it("int64 min", async () => {
      const v = "-9223372036854775808";

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "int64"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_int64(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_int64(v);
    });

    it("sint32 max", async () => {


      const v = 2147483647;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sint32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_sint32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_sint32(v);
    });

    it("sint32 min", async () => {


      const v = -2147483648;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sint32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_sint32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_sint32(v);
    });

    it("sint64 max", async () => {


      const v = "9223372036854775807";

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sint64"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_sint64(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_sint64(v);
    });

    it("sint64 min", async () => {


      const v = "-9223372036854775808";

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sint64"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_sint64(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_sint64(v);
    });

    it("bool true", async () => {


      const v = true;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "bool"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_bool(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_bool(v);
    });

    it("bool false", async () => {


      const v = false;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "bool"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_bool(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_bool(v);
    });

    it("enum", async () => {


      const EnumStruct = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
      };

      const v = EnumStruct.THREE;

      const Message = new protobuf.Type("Message")
        .add(new protobuf.Field("field", 1, "bool"))
        .add(new protobuf.Field("field2", 2, "Enum"))
        .add(new protobuf.Enum("Enum", EnumStruct));
      const message = Message.create({ field: 1, field2: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_enum(v);
      expect(result).to.be.equal("0x" + encoded.slice(6));

      await instance.encode_enum(v);
    });

    it("bits64", async () => {


      const v = "4294967296";

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "fixed64"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_bits64(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_bits64(v);
    });

    it("fixed64", async () => {


      const v = "4294967296";

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "fixed64"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_fixed64(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_fixed64(v);
    });

    it("sfixed64 max", async () => {


      const v = "9223372036854775807";

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sfixed64"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_sfixed64(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_sfixed64(v);
    });

    it("sfixed64 min", async () => {


      const v = "-9223372036854775808";

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sfixed64"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_sfixed64(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_sfixed64(v);
    });

    it("bits32", async () => {


      const v = 300;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "fixed32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_bits32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_bits32(v);
    });

    it("fixed32", async () => {


      const v = 300;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "fixed32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_fixed32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_fixed32(v);
    });

    it("sfixed32 max", async () => {


      const v = 2147483647;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sfixed32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_sfixed32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_sfixed32(v);
    });

    it("sfixed32 min", async () => {


      const v = -2147483648;

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "sfixed32"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_sfixed32(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_sfixed32(v);
    });

    it("length-delimited", async () => {


      const v = Buffer.from("deadbeef", "hex");

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "bytes"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_length_delimited(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_length_delimited(v);
    });

    it("string", async () => {


      const v = "foobar";

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "string"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_string(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_string(v);
    });

    it("bytes", async () => {


      const v = Buffer.from("deadbeef", "hex");

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "bytes"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_bytes(v);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_bytes(v);
    });

    it("embedded message", async () => {


      const v = 300;

      const EmbeddedMessage = new protobuf.Type("EmbeddedMessage").add(new protobuf.Field("field", 1, "uint64"));
      const embeddedMessage = EmbeddedMessage.create({ field: 300 });

      const encodedEmbeddedMessage = EmbeddedMessage.encode(embeddedMessage).finish().toString("hex");

      const Message = new protobuf.Type("Message")
        .add(new protobuf.Field("field", 1, "EmbeddedMessage"))
        .add(EmbeddedMessage);
      const message = Message.create({ field: embeddedMessage });

      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_embedded_message("0x" + encodedEmbeddedMessage);
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_embedded_message("0x" + encodedEmbeddedMessage);
    });

    it("packed repeated", async () => {


      const v = [300, 42, 69];

      const Message = new protobuf.Type("Message").add(new protobuf.Field("field", 1, "uint64", "repeated"));
      const message = Message.create({ field: v });
      const encoded = Message.encode(message).finish().toString("hex");

      const result = await instance.callStatic.encode_packed_repeated("0x" + encoded.slice(4));
      expect(result).to.be.equal("0x" + encoded.slice(2));

      await instance.encode_packed_repeated("0x" + encoded.slice(4));
    });
  });
});
