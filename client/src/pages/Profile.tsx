import { LegacyRef, useRef, useState, useEffect, ChangeEvent, FormEvent } from "react"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { selectUser } from "../redux/slices/user.slice"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import app from "../utils/firebase"
import { deleteUserAsync, signOutAsync, updateUserAsync } from "../redux/actions/user.action"
import { Link, useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import UserProfileListing from "../components/UserProfileListing"

const Profile = () => {
  const { user, loading } = useAppSelector(selectUser)
  const fileRef: LegacyRef<HTMLInputElement> = useRef(null)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [filePerc, setFilePerc] = useState(0)
  const [fileError, setFileError] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [userLisitngs, setUserListings] = useState<IListing[]>([])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.id) {
      case "username":
        if (!e.target.value) delete formData["username"]
        else setFormData(prev => ({ ...prev, username: e.target.value }))
        break;
      case "email":
        if (!e.target.value) delete formData["email"]
        else setFormData(prev => ({ ...prev, email: e.target.value }))
        break;
    }
  }

  const updateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(
      updateUserAsync({ userId: user?._id as string, ...formData })
    ).unwrap()
    .then(() => {
      setUpdateSuccess(true)
    })
    .catch((err) => {
      setError((err as any).message)
    })
  }

  const deleteUser = async () => {
    dispatch(deleteUserAsync(user?._id as string))
      .unwrap()
      .then(() => {
        navigate("/")
      })
      .catch((err) => {
        setError((err as any).message)
      })
  }

  const signOut = async () => {
    dispatch(signOutAsync())
      .unwrap()
      .then(() => {
        navigate("/")
      })
      .catch((err) => {
        setError((err as any).message)
      })
  }
  
  const handleFileUpload = (fileToUpload: File) => {
    setFilePerc(0)
    setFileError(false)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + fileToUpload.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload)

    uploadTask.on("state_changed", 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(progress)
        setFilePerc(Math.round(progress))
      },
      () => {
        setFileError(true)
        setFilePerc(0)
        setFile(null)
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        setFormData({ ...formData, avatar: url })
        setFilePerc(0)
        setFile(null)
        setFileError(false)
      }
    )
  }

  const deleteListing = async (listingId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/listing/${listingId}`, {
        method: "DELETE",
        credentials: "include"
      })
      if (res.ok) {
        setUserListings(prev => prev.filter(l => l._id !== listingId))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getUserListings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/user/listings/${user?._id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        })
        const data = await res.json()
        setUserListings(data.listings)
      } catch (error) {
        console.log(error)
      }
    }
    if (user?._id) getUserListings()
  }, [user?._id])

  useEffect(() => {
    if (file) handleFileUpload(file)
  }, [file])

  if (loading) {
    // TODO: Loading 
    return <div className="text-center">Loading...</div>
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>
      <form onSubmit={updateUser} className="flex flex-col gap-4">
        <input 
          type="file"
          hidden
          accept="image/*"
          ref={fileRef}
          onChange={e => setFile(e.target.files && e.target.files[0])}
        />
        <img 
          src={formData.avatar || user?.avatar}
          onClick={() => fileRef.current?.click()}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
        />
        <p className="text-sm self-center">
          {fileError && (
            <span className="text-red-700">
              Error while uploading the image (Image must be less than 2 mb)
            </span>
          )}
          {
            filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">
                Image Uploading {filePerc}%
              </span>
            ) : filePerc === 100 ? (
              <span className="text-green-700">
                Successfully Uploaded
              </span>
            ) : ""
          }
        </p>
        <input 
          type="text" 
          className="rounded-lg p-3 border"
          placeholder="username"
          id="username"
          defaultValue={user?.username}
          onChange={handleChange}
        />
        <input 
          type="email" 
          className="rounded-lg p-3 border"
          placeholder="email"
          id="email"
          defaultValue={user?.email}
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between items-center mt-5">
        <span onClick={deleteUser} className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span onClick={signOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && <p className="text-green-700 mt-5">User Updated Successfully</p>}
      <div className="flex flex-col gap-4">
        {userLisitngs.length > 0 && <h1 className="text-center mt-7 text-3xl font-semibold">Your Listings</h1>}
        {userLisitngs.map(l => 
          <UserProfileListing key={l._id} listing={l} deleteListing={deleteListing} />
        )}
      </div>
    </div>
  )
}

export default Profile