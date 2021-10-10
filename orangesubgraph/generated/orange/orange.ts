// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class JobAccepted extends ethereum.Event {
  get params(): JobAccepted__Params {
    return new JobAccepted__Params(this);
  }
}

export class JobAccepted__Params {
  _event: JobAccepted;

  constructor(event: JobAccepted) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get acceptor(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class JobCreated extends ethereum.Event {
  get params(): JobCreated__Params {
    return new JobCreated__Params(this);
  }
}

export class JobCreated__Params {
  _event: JobCreated;

  constructor(event: JobCreated) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get cid(): string {
    return this._event.parameters[1].value.toString();
  }

  get type_(): string {
    return this._event.parameters[2].value.toString();
  }

  get name(): string {
    return this._event.parameters[3].value.toString();
  }

  get numCpus(): i32 {
    return this._event.parameters[4].value.toI32();
  }

  get memBytes(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class JobOutputPut extends ethereum.Event {
  get params(): JobOutputPut__Params {
    return new JobOutputPut__Params(this);
  }
}

export class JobOutputPut__Params {
  _event: JobOutputPut;

  constructor(event: JobOutputPut) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get cid(): string {
    return this._event.parameters[1].value.toString();
  }
}

export class orange__getJobResultValue0Struct extends ethereum.Tuple {
  get isValid(): boolean {
    return this[0].toBoolean();
  }

  get cid(): string {
    return this[1].toString();
  }

  get type_(): string {
    return this[2].toString();
  }

  get name(): string {
    return this[3].toString();
  }

  get available(): boolean {
    return this[4].toBoolean();
  }

  get acceptedBy(): Address {
    return this[5].toAddress();
  }

  get outputCid(): string {
    return this[6].toString();
  }

  get numCpus(): i32 {
    return this[7].toI32();
  }

  get memBytes(): BigInt {
    return this[8].toBigInt();
  }
}

export class orange extends ethereum.SmartContract {
  static bind(address: Address): orange {
    return new orange("orange", address);
  }

  getJob(jobId: BigInt): orange__getJobResultValue0Struct {
    let result = super.call(
      "getJob",
      "getJob(uint256):((bool,string,string,string,bool,address,string,uint8,uint128))",
      [ethereum.Value.fromUnsignedBigInt(jobId)]
    );

    return result[0].toTuple() as orange__getJobResultValue0Struct;
  }

  try_getJob(
    jobId: BigInt
  ): ethereum.CallResult<orange__getJobResultValue0Struct> {
    let result = super.tryCall(
      "getJob",
      "getJob(uint256):((bool,string,string,string,bool,address,string,uint8,uint128))",
      [ethereum.Value.fromUnsignedBigInt(jobId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTuple() as orange__getJobResultValue0Struct
    );
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AddJobCall extends ethereum.Call {
  get inputs(): AddJobCall__Inputs {
    return new AddJobCall__Inputs(this);
  }

  get outputs(): AddJobCall__Outputs {
    return new AddJobCall__Outputs(this);
  }
}

export class AddJobCall__Inputs {
  _call: AddJobCall;

  constructor(call: AddJobCall) {
    this._call = call;
  }

  get id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get cid(): string {
    return this._call.inputValues[1].value.toString();
  }

  get type_(): string {
    return this._call.inputValues[2].value.toString();
  }

  get name(): string {
    return this._call.inputValues[3].value.toString();
  }

  get numCpus(): i32 {
    return this._call.inputValues[4].value.toI32();
  }

  get memBytes(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }
}

export class AddJobCall__Outputs {
  _call: AddJobCall;

  constructor(call: AddJobCall) {
    this._call = call;
  }
}

export class AcceptJobCall extends ethereum.Call {
  get inputs(): AcceptJobCall__Inputs {
    return new AcceptJobCall__Inputs(this);
  }

  get outputs(): AcceptJobCall__Outputs {
    return new AcceptJobCall__Outputs(this);
  }
}

export class AcceptJobCall__Inputs {
  _call: AcceptJobCall;

  constructor(call: AcceptJobCall) {
    this._call = call;
  }

  get id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get acceptor(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class AcceptJobCall__Outputs {
  _call: AcceptJobCall;

  constructor(call: AcceptJobCall) {
    this._call = call;
  }
}

export class PutJobOutputCall extends ethereum.Call {
  get inputs(): PutJobOutputCall__Inputs {
    return new PutJobOutputCall__Inputs(this);
  }

  get outputs(): PutJobOutputCall__Outputs {
    return new PutJobOutputCall__Outputs(this);
  }
}

export class PutJobOutputCall__Inputs {
  _call: PutJobOutputCall;

  constructor(call: PutJobOutputCall) {
    this._call = call;
  }

  get id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get cid(): string {
    return this._call.inputValues[1].value.toString();
  }
}

export class PutJobOutputCall__Outputs {
  _call: PutJobOutputCall;

  constructor(call: PutJobOutputCall) {
    this._call = call;
  }
}
