// Client Registration
// Ensure that the client is registered to use private_key_jwt and tls_client_auth. 

// Config Assert:
// Ensure that the test system has key binding turned on 
// (run a test with an incorrect cert / incorrect DN and ensure it fails)

// Stage 1:
// 1. Register a TPP using DCR using a OB Legacy Certificate
// 2. Create and approve an Account Access Consent (client)

// Stage 2:
// Generate a OBWAC and OBSeal for the TPP.
// See $OZONE_HOME/monorepo/crypto\certs\tpp\eidas-0015800001041RHAAY\certs.md

// The OBWAC has a different Subject DN from the OB Legacy Certificate. 
// To be able to use this, the call the DCR PUT endpoint and modify the 
// tls_client_auth_subject_dn claim to reflect the new subject. 
// Ensure that logs are maintained of the change
// Note: The OBSeal will be visible on the JWKS. No DCR change is required to recognise this.

// Stage 3:  Test new certs work properly
// All the following tests can be run in parallel and can be split across the team.

// Ensure that a full AIS flow completes with the new certificates using tls_client_auth 
// Ensure that a full AIS flow completes with the new certificates using private_key_jwt
// Ensure that a full PIS flow completes with the new certificates (including new signing cert based on OBSeal)
// Ensure that the refresh token can be refreshed and subsequently AIS endpoints can be called using tls_client_auth 
// Ensure that the refresh token can be refreshed and subsequently AIS endpoints can be called using private_key_jwt


// Stage 4:  Test that old AIS consent can be used without a re-auth
// Here, we want to verify that the AIS consent that was generated in  Stage 1 can be used without a re-auth.
// The MTLS standard specifies that the access token is bound to the cert hash - but not the refresh token. Our way out is to refresh the token  and then use it
// Ensure that the old AIS consent cannot be used with new OBWAC. You should see an error generated.
// With the token generated in Stage 1, run a refresh token grant using tls_client_auth to get a new access token. Ensure that the new access token can be used
// Run the same exercise again this time using private_key_jwt. You will need to switch the client back 