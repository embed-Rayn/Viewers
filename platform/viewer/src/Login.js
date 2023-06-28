import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ViewerbaseDragDropContext } from '@ohif/ui';
import { withRouter } from 'react-router';
import {LoginAPI} from 'apis'
// import { Svg } from '@ohif/ui';
import { useForm } from 'react-hook-form';
import { Cookies } from 'react-cookie';

const axios = require('axios');
const host = 'http://grk-backend.medical-lab.co.kr/'
// https://velog.io/@tootb/main-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-react-cookie-jwt-decode 참고
class Login extends Component {
  saveId = localStorage.getItem('saveId');

  constructor() {
    const {
      register,
      handleSubmit,
      formState: { isSubmitting, isDirty, errors },
    } = useForm({
      defaultValues: { saveId: saveId ? true : false, id: saveId },
    });

  // Set body style
  useEffect(() => {
    console.log('window.crossOriginIsolated', window.crossOriginIsolated);
    document.body.classList.add('bg-black');
    return () => {
      document.body.classList.remove('bg-black');
    };
  }, []);
  }
  render() {
    const handleSubmit = () =>{

    }
    const onSubmit = async data => {
      console.log('------------------------------start-----------');
      await new Promise(r => setTimeout(r, 1000));
      //console.log(data);
      data.id.toUpperCase();

      try {
        const loginForm = {
          'userId': data.id,
          'password': data.password,
        }
        const response = LoginAPI(loginForm)
        const jwtData = response.data;

        setCookie('accessJwtToken', jwtToken);
      } catch {
        alert('로그인이 실패했습니다. 정보가 올바른지 다시 확인해주세요.');
      }
      const resFromServer = axios
        .post(host+'/api/v1/token/', {
          'userId': data.id,
          'password': data.password,
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });

      console.log(tokens);
      console.log(data.saveId+"//"+data.password);

      if (resFromServer.code) { // 응답에 code가 존재할 경우(토큰 받아왔을 경우)
        const cookies = new Cookies();
        cookies.set("GRKaccessToken", resFromServer.data.accessToken, {});
        cookies.set("GRKrefreshToken", resFromServer.data.refreshToken, {});
        if (data.saveId) {
          localStorage.setItem('saveId', data.id);
        } else {
          localStorage.removeItem('saveId');
        }
        localStorage.setItem('isLogin', 'OK');
        navigate('/project');
      } else {
        alert('아이디 비번을 확인하세요');
      }
    };
    const isDirty = undefined
    // const register = () =>{

    // }

    const errors = {'id':  'false'}
    // const isSubmitting = 'disabled'

    return (
      <section className="h-full gradient-form bg-black md:h-screen">
      <div className="w-full py-12 px-12 h-full">
        <div className="flex justify-center items-center flex-wrap h-full g-6  text-white">
          <div className="w-80">
            <div className="lg:flex-wrap g-0">
              <div className="text-center">
                <h4 className="text-2xl font-semibold mt-1 mb-4 pb-1">LOGIN</h4>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-2 text-base font-normal text-gray-300 bg-gray-900 bg-clip-padding border border-solid border-gray-800 rounded transition ease-in-out m-0 focus:text-gray-300 focus:bg-gray-800 focus:border-cyan-600 focus:outline-none"
                    id="id"
                    placeholder="ID"
                    aria-invalid={
                      !isDirty ? undefined : errors.id ? 'true' : 'false'
                    }
                    {...register('id', {
                      required: '아이디를 입력바랍니다.',
                    })}
                  />
                  {errors.id && (
                    <small className="mt-2 text-red-600" role="alert">
                      {errors.id.message}
                    </small>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    className="form-control block w-full px-3 py-2 text-base font-normal text-gray-300 bg-gray-900 bg-clip-padding border border-solid border-gray-800 rounded transition ease-in-out m-0 focus:text-gray-300 focus:bg-gray-800 focus:border-cyan-600 focus:outline-none"
                    id="password"
                    placeholder="PASSWORD"
                    aria-invalid={
                      !isDirty ? undefined : errors.password ? 'true' : 'false'
                    }
                    {...register('password', {
                      required: '비밀번호는 필수 입력입니다.',
                      minLength: {
                        value: 8,
                        message: '8자리 이상 비밀번호를 사용하세요.',
                      },
                    })}
                  />
                  {errors.password && (
                    <small className="mt-2 text-red-600" role="alert">
                      {errors.password.message}
                    </small>
                  )}
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div className="form-group form-check">
                    <input
                      type="checkbox"
                      className="form-check-input appearance-none h-4 w-4 border border-gray-800 rounded-sm bg-gray-900 checked:bg-primary-light checked:border-cyan-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      id="exampleCheck2"
                      {...register('saveId')}
                    />
                    <label
                      className="form-check-label inline-block text-white text-sm"
                      htmlFor="exampleCheck2"
                    >
                      Remember ID
                    </label>
                  </div>
                  <a
                    href="#!"
                    className="text-white underline underline-offset-1 text-sm"
                  >
                    Forgot Password?
                  </a>
                </div>

                <div className="text-center lg:text-left">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-block w-full px-7 py-3 bg-primary-light text-gray-900 font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-primary-light hover:shadow-lg focus:bg-primary-light focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-light active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Login
                  </button>
                  <p className="text-base mt-6 pt-1 mb-0 text-center">
                    Don't have an account?
                    <a
                      href="#!"
                      className="text-primary-light ml-4 underline hover:text-primary-light focus:text-primary-light transition duration-200 ease-in-out"
                    >
                      Sing Up
                    </a>
                  </p>
                </div>
                <div className="mt-48  flex justify-center">
                  {/* <Svg
                    name="logo-ohif"
                    style={{ width: '180px', height: '40px' }}
                  /> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    );
    }
}

const mapStateToProps = state => {
  return {
    user: state.oidc.user,
  };
};


const ConnectedLogin = connect(
  mapStateToProps,
  null
)(Login);

export default ViewerbaseDragDropContext(
  withRouter(ConnectedLogin)
);
