// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * UserInfo with user displayName, objectId and preferredUserName.
 *
 * @beta
 */
export interface UserInfo {
  /**
   * User Display Name.
   *
   * @readonly
   */
  displayName: string;

  /**
   * User unique reference within the Azure Active Directory domain.
   *
   * @readonly
   */
  objectId: string;

  /**
   * Usually be the email address.
   *
   * @readonly
   */
  preferredUserName: string;
}

export interface UserTenantIdAndLoginHint {
  /**
   * User Login Hint.
   *
   * @readonly
   */
  loginHint: string;

  /**
   * User Tenant Id.
   *
   * @readonly
   */
  tid: string;
}
