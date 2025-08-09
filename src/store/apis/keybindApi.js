import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const keybindApi = createApi({
    reducerPath: "keybindApi",
    baseQuery: fetchBaseQuery({ 
      baseUrl: "http://localhost:3002",
      credentials: "include",
      // prepareHeaders: (headers) => {
      //   const token = localStorage.getItem("token");
      //   if (token) {
      //     headers.set("authorization", `Bearer ${token}`);
      //   }
      //   return headers;
      // }
    }),
    tagTypes: ["Keybinds"],              
    endpoints: (builder) => ({
      getKeybinds: builder.query({
        query: () => "/keybinds",
        providesTags: ["Keybinds"],      
      }),
      updateKeybinds: builder.mutation({
        query: ({ username, keybinds }) => ({
          url: "/updateDatabase",
          method: "POST",
          body: { username, keybinds },
        }),
        invalidatesTags: ["Keybinds"],   
      }),
    }),
});


export const { useGetKeybindsQuery, useUpdateKeybindsMutation, useLazyGetKeybindsQuery } = keybindApi;
export { keybindApi };

